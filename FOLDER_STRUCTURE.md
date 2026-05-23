# SportStrike — Complete Folder Structure

```
sportstrike/
├── apps/
│   ├── api/                          # NestJS Backend
│   │   ├── src/
│   │   │   ├── main.ts               # Bootstrap + Swagger
│   │   │   ├── app.module.ts         # Root module
│   │   │   ├── auth/                 # JWT, OTP, Google OAuth ready
│   │   │   ├── users/                # Profile, KYC, betting history
│   │   │   ├── wallet/               # Deposits, withdrawals, ledger
│   │   │   ├── sports/               # Live/upcoming matches
│   │   │   ├── betting/              # Bet placement, parlay, cashout
│   │   │   ├── fantasy/              # Contests, teams, points engine
│   │   │   ├── predictions/          # Probo-style markets
│   │   │   ├── admin/                # Dashboard, KYC, settlements
│   │   │   ├── websocket/            # Socket.IO gateway
│   │   │   ├── notifications/        # Push, email, SMS ready
│   │   │   ├── ai/                   # Predictions, fraud detection
│   │   │   ├── mock-data/            # Live data simulator
│   │   │   ├── prisma/               # Prisma service
│   │   │   └── redis/                # Redis service
│   │   ├── package.json
│   │   └── nest-cli.json
│   │
│   └── web/                          # Next.js 15 Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx          # Homepage
│       │   │   ├── ipl/              # IPL live dashboard
│       │   │   ├── betting/          # Sportsbook
│       │   │   ├── fantasy/          # Fantasy contests
│       │   │   ├── predictions/      # Prediction markets
│       │   │   ├── wallet/           # Wallet UI
│       │   │   ├── admin/            # Admin analytics
│       │   │   ├── profile/          # User profile
│       │   │   ├── match/[id]/       # Match detail
│       │   │   └── auth/             # Login & register
│       │   ├── components/
│       │   │   ├── ui/               # Button, etc.
│       │   │   ├── layout/           # Navbar, ticker, mobile nav
│       │   │   ├── betting/          # Odds, markets, bet slip
│       │   │   └── match/            # Live score cards
│       │   ├── lib/                  # API client, socket, mock data
│       │   └── store/                # Zustand stores
│       ├── package.json
│       └── tailwind.config.ts
│
├── packages/
│   └── shared/                       # Shared types & WS events
│
├── prisma/
│   ├── schema.prisma                 # Full database schema
│   └── seed.ts                       # IPL mock data seeder
│
├── docker/
│   ├── Dockerfile.api
│   └── Dockerfile.web
│
├── nginx/
│   └── nginx.conf                    # Reverse proxy + rate limiting
│
├── .github/workflows/
│   └── ci.yml                        # CI/CD pipeline
│
├── docker-compose.yml
├── package.json                      # Monorepo root
├── README.md
├── DEPLOYMENT.md
├── SECURITY.md
└── .env.example
```
