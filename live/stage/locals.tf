locals {
  ssh_port          = 22
  secure_http_port  = 3000
  secure_https_port = 4000
  any_port          = 0
  any_protocol      = "-1"
  all_ips           = ["0.0.0.0/0"]
}
