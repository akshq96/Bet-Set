# SportStrike Deployment Guide

## AWS Deployment

### Architecture
```
CloudFront CDN → ALB → ECS (API + Web) → RDS PostgreSQL + ElastiCache Redis
```

### Steps

1. **RDS PostgreSQL** — Create `db.t3.medium` instance, enable Multi-AZ for production
2. **ElastiCache Redis** — Create Redis cluster for sessions and pub/sub
3. **ECS Fargate** — Deploy API and Web containers from ECR images
4. **ALB** — Route `/api/*` to API, `/*` to Web
5. **CloudFront** — Cache static assets, enable HTTPS
6. **Secrets Manager** — Store JWT_SECRET, DATABASE_URL, RAZORPAY keys

### Build & Push Images

```bash
aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URL

docker build -f docker/Dockerfile.api -t sportstrike-api .
docker build -f docker/Dockerfile.web -t sportstrike-web .

docker tag sportstrike-api:latest $ECR_URL/sportstrike-api:latest
docker push $ECR_URL/sportstrike-api:latest
```

## Vercel (Frontend Only)

```bash
cd apps/web
vercel --prod
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`

## Environment Checklist

- [ ] Change all secrets in `.env`
- [ ] Enable SSL/TLS certificates
- [ ] Configure Firebase for OTP
- [ ] Set up Razorpay production keys
- [ ] Configure SMTP for emails
- [ ] Set up monitoring (Datadog/Sentry)
- [ ] Enable database backups
- [ ] Configure auto-scaling policies

## Database Migrations

```bash
npx prisma migrate deploy --schema=./prisma/schema.prisma
npm run db:seed  # First deploy only
```

## Health Checks

- API: `GET /api/mock/status`
- Web: `GET /`
