# AI Expense Coach on AWS

Full-stack monorepo for an AI-assisted personal finance coaching application with:

- `frontend/`: Next.js dashboard UI
- `backend/`: Node.js + Express API
- `infra/`: Terraform for AWS VPC, EC2, RDS, and CloudWatch
- `docker-compose.yml`: local and EC2 deployment stack

## Features

- Email/password authentication with JWT cookies
- Manual expense tracking
- CSV statement import
- Budget creation and budget-vs-actual analytics
- AI categorization fallback and monthly coaching summaries
- Dockerized local environment
- Terraform-based AWS deployment target

## Quick start

1. Copy environment examples in `frontend/.env.example` and `backend/.env.example`.
2. Add your OpenAI key before starting if you want live AI categorization and summaries:

```powershell
$env:OPENAI_API_KEY="your-openai-api-key"
$env:OPENAI_MODEL="gpt-4o-mini"
```

2. Run `docker compose up --build`.
3. Open `http://localhost`.

## API routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`
- `GET /api/budgets`
- `POST /api/budgets`
- `POST /api/imports/csv`
- `POST /api/ai/categorize`
- `GET /api/ai/monthly-summary?month=YYYY-MM`

## CSV import format

Use a CSV file with headers:

```csv
date,merchant,amount,description,currency
2026-04-20,Fresh Basket,42.75,Weekly groceries,USD
```

A full 30-day sample file is included at `statement.csv`.

## AWS deployment

1. Copy `infra/terraform.tfvars.example` to `infra/terraform.tfvars`.
2. Set at least `db_password`, `key_name`, and optionally `openai_api_key`, `ssh_allowed_cidr`, and `app_domain`.
3. Run `terraform init`, `terraform validate`, and `terraform apply` from `infra/`.
4. Read the generated outputs:
   `terraform output app_url`
   `terraform output ec2_public_ip`
   `terraform output rds_endpoint`
5. SSH into EC2, clone this repo into `/opt/expense-coach`, and create the backend env from the Terraform outputs.
6. On the EC2 host, run `docker compose up --build -d`.
7. Open the URL from `terraform output app_url`.

Suggested backend env on EC2:

```env
PORT=4000
NODE_ENV=production
DATABASE_URL=postgresql://expense_user:<db_password>@<rds-endpoint>:5432/expense_coach
JWT_SECRET=change-me-to-a-long-secret
OPENAI_API_KEY=<your-openai-key>
OPENAI_MODEL=gpt-4o-mini
FRONTEND_URL=http://<ec2-public-ip-or-domain>
```

## Project structure

```text
frontend/  Next.js application
backend/   Express API and PostgreSQL data access
infra/     Terraform configuration and EC2 bootstrap script
```
