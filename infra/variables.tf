variable "project_name" {
  type    = string
  default = "expense-coach"
}

variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "vpc_cidr" {
  type    = string
  default = "10.20.0.0/16"
}

variable "public_subnets" {
  type    = list(string)
  default = ["10.20.1.0/24", "10.20.2.0/24"]
}

variable "private_subnets" {
  type    = list(string)
  default = ["10.20.11.0/24", "10.20.12.0/24"]
}

variable "db_name" {
  type    = string
  default = "expense_coach"
}

variable "db_username" {
  type    = string
  default = "expense_user"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "db_engine_version" {
  type    = string
  default = "15.15"
}

variable "openai_api_key" {
  type      = string
  default   = ""
  sensitive = true
}

variable "openai_model" {
  type    = string
  default = "gpt-4o-mini"
}

variable "key_name" {
  type        = string
  description = "Existing AWS EC2 key pair name"
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "ssh_allowed_cidr" {
  type    = string
  default = "0.0.0.0/0"
}

variable "app_domain" {
  type    = string
  default = ""
}
