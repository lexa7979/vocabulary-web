terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  # https://app.terraform.io/app/lexa79/workspaces
  cloud {
    organization = "lexa79"
    workspaces {
      name = "vocabulary-web-stage"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.region
}

resource "aws_instance" "frontend" {
  ami = var.instance_ami
  instance_type = var.instance_type

  user_data = templatefile("setup.sh", {})
  user_data_replace_on_change = true

  vpc_security_group_ids = [aws_security_group.frontend.id]
  # security_groups = []
  # subnet_id = aws_subnet.vocabulary.id

  tags = {
    Name = var.instance_name
  }
}
