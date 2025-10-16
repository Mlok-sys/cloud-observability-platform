output "ec2_public_ip" {
  value = aws_instance.monitoring_server.public_ip
}

output "grafana_url" {
  value = "http://${aws_instance.monitoring_server.public_ip}:3000"
}
output "elastic_ip" {
  description = "fixed IP"
  value       = aws_eip.ec2_eip.public_ip
}
resource "aws_ami_from_instance" "Monitoring_server_ami" {
  name               = "cloud-observability-ami-${formatdate("YYYYMMDD-hhmmss", timestamp())}"
  source_instance_id = aws_instance.monitoring_server.id
  depends_on         = [aws_instance.monitoring_server]

  tags = {
    Name = "cloud-observability-ami"
  }
}
