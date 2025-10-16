resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    name = "${var.project_name}-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "me-south-1a"
  tags = {
    name = "${var.project_name}-subnet"
  }

}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id

}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

resource "aws_route_table_association" "public_assoc" {
  route_table_id = aws_route_table.public.id
  subnet_id      = aws_subnet.public.id
}

resource "aws_security_group" "ec2_sg" {
  name        = "$(var.project_name)-sg"
  description = "Allow SSH, HTTP, Grafana, Prometheus"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

  }
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 3100
    to_port     = 3100
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

  }
  ingress {
    description = "Allow App traffic"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

}
resource "aws_instance" "monitoring_server" {
  ami                    = "ami-0115748e9cebc5543"
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  key_name               = var.key_name
  tags = {
    name = "${var.project_name}-ec2"
  }



  user_data = <<-EOF
    #!/bin/bash
    # Update packages
    yum update -y

    # Install Docker & Git
    yum install -y docker git

    # Enable and start Docker
    systemctl enable docker
    systemctl start docker

    # Install Docker Compose (v2 plugin)
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

    # Go to monitoring directory (Terraform should copy files here)
    cd /home/ec2-user/CLOUD-OBSERVABILITY-PLATFORM/monitoring

    # Start your monitoring stack
    sudo /usr/local/bin/docker-compose up -d --build
    EOF

}
resource "aws_eip" "ec2_eip" {
  instance = aws_instance.monitoring_server.id
  tags = {
    Name = "cloud-observability-eip"
  }
}
