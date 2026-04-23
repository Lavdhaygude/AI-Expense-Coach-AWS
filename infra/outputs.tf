output "ec2_public_ip" {
  value = aws_eip.app.public_ip
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.address
}

output "cloudwatch_log_group" {
  value = aws_cloudwatch_log_group.app.name
}

output "app_url" {
  value = local.app_url
}

output "deployment_env" {
  sensitive = true
  value = {
    DATABASE_URL    = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.address}:5432/${var.db_name}"
    FRONTEND_URL    = local.app_url
    OPENAI_MODEL    = var.openai_model
    OPENAI_API_KEY  = var.openai_api_key
  }
}
