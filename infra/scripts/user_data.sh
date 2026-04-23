#!/bin/bash
set -eux

dnf update -y
dnf install -y docker amazon-cloudwatch-agent git
systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user

curl -L "https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

mkdir -p ${compose_app_dir}
chown ec2-user:ec2-user ${compose_app_dir}

mkdir -p /opt/aws/amazon-cloudwatch-agent/etc
cat >/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json <<EOF
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/messages",
            "log_group_name": "${log_group_name}",
            "log_stream_name": "{instance_id}/messages"
          },
          {
            "file_path": "/var/lib/cloud/instances/*/user-data.txt",
            "log_group_name": "${log_group_name}",
            "log_stream_name": "{instance_id}/user-data"
          }
        ]
      }
    }
  }
}
EOF

/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
  -s

cat >/home/ec2-user/DEPLOY_APP.md <<EOF
# Deploy Expense Coach

1. SSH into this server:
   ssh -i <your-key>.pem ec2-user@$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
2. Clone your repository into ${compose_app_dir}
3. Create backend env values:
   DATABASE_URL=postgresql://expense_user:<db_password>@<rds-endpoint>:5432/expense_coach
   FRONTEND_URL=http://<ec2-public-ip-or-domain>
4. Start the app:
   docker compose up --build -d
EOF

chown ec2-user:ec2-user /home/ec2-user/DEPLOY_APP.md
