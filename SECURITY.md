# Security Best Practices

## Authentication
- JWT access tokens expire in 15 minutes
- Refresh tokens stored in database with device info
- bcrypt with 12 salt rounds for passwords
- OTP expires in 5 minutes, rate-limited to 5/minute

## API Security
- Helmet.js for HTTP security headers
- NestJS Throttler: 100 req/min global, 5 req/min for auth
- class-validator input sanitization on all DTOs
- Prisma ORM prevents SQL injection
- CORS configured per environment

## Wallet Security
- Balance mutations only via Prisma transactions
- Withdrawal requires admin approval
- Audit logs for all financial operations
- encryptionSalt field for future wallet encryption

## Infrastructure
- Nginx rate limiting zones (api: 30r/s, auth: 5r/s)
- DDoS protection via CloudFlare/AWS Shield
- Secrets in environment variables, never in code
- Docker containers run as non-root users

## Fraud Detection
- High-frequency transaction monitoring
- AI risk scoring endpoint (`/api/ai/fraud/:userId`)
- Admin fraud alert dashboard
- IP-based session tracking

## Reporting Vulnerabilities
Email: security@sportstrike.com
