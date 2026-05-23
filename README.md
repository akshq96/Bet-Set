# SportStrike

Premium real-time sports betting, fantasy cricket, and prediction markets platform — inspired by Probo, Dream11, Stake, and Bet365.

![Stack](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![NestJS](https://img.shields.io/badge/NestJS-11-red?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square)
![Redis](https://img.shields.io/badge/Redis-7-red?style=flat-square)

## Features

| Module | Description |
|--------|-------------|
| **Live Betting** | IPL ball-by-ball, over betting, toss, match winner, parlay, cashout |
| **Fantasy Sports** | Dream11-style contests, captain 2x, vice-captain 1.5x, live leaderboard |
| **Prediction Markets** | Probo-style YES/NO shares, AMM pricing, portfolio tracking |
| **Wallet** | Deposits (Razorpay/UPI mock), withdrawals, bonus wallet, ledger |
| **Admin Panel** | KYC approval, bet settlement, fraud alerts, revenue analytics |
| **Real-Time** | Socket.IO for odds, scores, wallet, chat, notifications |
| **AI** | Match predictions, personalized recommendations, fraud scoring |

## Architecture

```
sportstrike/
├── apps/
│   ├── api/          # NestJS REST + WebSocket API
│   └── web/          # Next.js 15 frontend
├── packages/
│   └── shared/       # Shared types & constants
├── prisma/           # Database schema & seed
├── docker/           # Dockerfiles
├── nginx/            # Reverse proxy config
└── .github/          # CI/CD workflows
```

## Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts, Socket.IO client

**Backend:** NestJS, PostgreSQL, Redis, Prisma ORM, JWT, Socket.IO, Swagger

**Infrastructure:** Docker Compose, Nginx, GitHub Actions CI

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (recommended)

### 1. Clone & Install

```bash
cd sportstrike
cp .env.example .env
npm install
```

### 2. Start Infrastructure

```bash
docker compose up -d postgres redis
```

### 3. Database Setup

```bash
npm run db:push
npm run db:seed
```

### 4. Run Development

```bash
npm run dev
```

- **Web:** http://localhost:3000
- **API:** http://localhost:4000
- **Swagger:** http://localhost:4000/docs

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sportstrike.com | (set via seed) |
| User | demo@sportstrike.com | password123 |

## Docker Production

```bash
docker compose up --build
```

Access via Nginx at http://localhost (port 80).

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Email registration |
| POST | `/api/auth/login` | Email/password login |
| POST | `/api/auth/otp/send` | Send mobile OTP |
| POST | `/api/auth/otp/verify` | Verify OTP |
| GET | `/api/sports/live` | Live matches |
| GET | `/api/betting/markets/:matchId` | Match markets |
| POST | `/api/betting/place` | Place bet |
| POST | `/api/betting/cashout` | Cash out bet |
| GET | `/api/fantasy/contests` | Fantasy contests |
| POST | `/api/fantasy/join` | Join contest |
| GET | `/api/predictions/markets` | Prediction markets |
| POST | `/api/predictions/trade` | Trade shares |
| GET | `/api/wallet` | Wallet balance |
| POST | `/api/wallet/deposit` | Deposit funds |
| GET | `/api/admin/dashboard` | Admin stats |

## WebSocket Events

```typescript
// Client → Server
socket.emit('join:match', matchId);
socket.emit('join:market', marketId);

// Server → Client
'odds:update'      // Live odds changes
'match:score'      // Ball-by-ball updates
'bet:result'       // Bet settlement
'wallet:update'    // Balance changes
'prediction:price' // Market price updates
```

## Environment Variables

See [`.env.example`](.env.example) for all configuration options.

Key variables:
- `DATABASE_URL` — PostgreSQL connection
- `REDIS_URL` — Redis connection
- `JWT_SECRET` — JWT signing key
- `RAZORPAY_KEY_ID` — Payment gateway (optional)

## Security

- Helmet.js security headers
- Rate limiting (Nginx + NestJS Throttler)
- bcrypt password hashing (12 rounds)
- JWT access + refresh tokens
- Prisma parameterized queries (SQL injection prevention)
- Input validation via class-validator
- Audit logging for admin actions
- Fraud detection scoring

## Scaling

Designed for horizontal scaling:
- Stateless API servers behind Nginx load balancer
- Redis pub/sub for WebSocket fan-out across instances
- PostgreSQL read replicas for analytics queries
- CDN for static assets (`/_next/static/`)

## Mock Data

The platform includes a mock sports data simulator that generates:
- Live ball-by-ball commentary
- Odds movement every 5 seconds
- Prediction market price updates

Replace with CricAPI, Sportradar, or similar in production via `SPORTS_DATA_PROVIDER`.

## License

Proprietary — All rights reserved.

---

**⚠️ Disclaimer:** This is a demonstration platform. Real-money gambling requires appropriate licenses and regulatory compliance in your jurisdiction.
