variable "project_name" {
  default = "cloud-observability"
}

variable "instance_type" {
  default = "t3.micro"
}

variable "key_name" {
  description = "EC2 key pair name"
  default     = "Observe"
}
