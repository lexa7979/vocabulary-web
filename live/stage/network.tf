# resource "aws_vpc" "vocabulary_env" {
#   cidr_block = "10.0.0.0/16"
#   enable_dns_hostnames = true
#   enable_dns_support = true

#   tags {
#     Name = "vocabulary-env"
#   }
# }

# resource "aws_subnet" "vocabulary" {
#   cidr_block = "${cidrsubnet(aws_vpc.vocabulary_env.cidr_block, 3, 1)}"
#   vpc_id = aws_vpc.vocabulary_env.id
#   availability-zone = "${var.region}a"
# }

resource "aws_security_group" "frontend" {
  name = "vocabulary-web-frontend"

  ingress {
    from_port   = local.ssh_port
    to_port     = local.ssh_port
    protocol    = "tcp"
    cidr_blocks = local.all_ips
  }

  ingress {
    from_port   = local.secure_http_port
    to_port     = local.secure_http_port
    protocol    = "tcp"
    cidr_blocks = local.all_ips
  }

  ingress {
    from_port   = local.secure_https_port
    to_port     = local.secure_https_port
    protocol    = "tcp"
    cidr_blocks = local.all_ips
  }

  egress {
    from_port   = local.any_port
    to_port     = local.any_port
    protocol    = local.any_protocol
    cidr_blocks = local.all_ips
  }
}
