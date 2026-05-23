/**
 * Database seed — IPL teams, live matches, markets, fantasy contests, prediction markets
 */
import { PrismaClient, SportType, MatchStatus, MarketType, ContestType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SportStrike database...');

  // Sports
  const cricket = await prisma.sport.upsert({
    where: { slug: 'cricket' },
    update: {},
    create: { name: 'Cricket', slug: 'cricket', type: SportType.CRICKET, icon: '🏏', sortOrder: 1 },
  });
  const football = await prisma.sport.upsert({
    where: { slug: 'football' },
    update: {},
    create: { name: 'Football', slug: 'football', type: SportType.FOOTBALL, icon: '⚽', sortOrder: 2 },
  });
  await prisma.sport.upsert({
    where: { slug: 'kabaddi' },
    update: {},
    create: { name: 'Kabaddi', slug: 'kabaddi', type: SportType.KABADDI, icon: '🤼', sortOrder: 3 },
  });

  // IPL Tournament
  const ipl = await prisma.tournament.upsert({
    where: { slug: 'ipl-2026' },
    update: {},
    create: {
      sportId: cricket.id,
      name: 'Indian Premier League 2026',
      slug: 'ipl-2026',
      season: '2026',
      logo: '/teams/ipl.png',
    },
  });

  // Teams
  const teams = await Promise.all(
    [
      { name: 'Mumbai Indians', shortName: 'MI', logo: '/teams/mi.png' },
      { name: 'Chennai Super Kings', shortName: 'CSK', logo: '/teams/csk.png' },
      { name: 'Royal Challengers Bengaluru', shortName: 'RCB', logo: '/teams/rcb.png' },
      { name: 'Kolkata Knight Riders', shortName: 'KKR', logo: '/teams/kkr.png' },
      { name: 'Delhi Capitals', shortName: 'DC', logo: '/teams/dc.png' },
      { name: 'Rajasthan Royals', shortName: 'RR', logo: '/teams/rr.png' },
    ].map((t) =>
      prisma.team.upsert({
        where: { id: t.shortName },
        update: t,
        create: { id: t.shortName, ...t, country: 'India' },
      }),
    ),
  );

  // Live IPL match
  const liveMatch = await prisma.match.create({
    data: {
      tournamentId: ipl.id,
      homeTeamId: 'MI',
      awayTeamId: 'CSK',
      status: MatchStatus.LIVE,
      venue: 'Wankhede Stadium, Mumbai',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      liveScore: {
        innings: 2,
        batting: 'CSK',
        score: '142/4',
        overs: '15.2',
        runRate: 9.32,
        required: 48,
        ballsRemaining: 28,
        lastBall: { runs: 4, type: 'boundary' },
      },
      commentary: [
        { over: '15.2', text: 'FOUR! Dhoni finds the gap at deep mid-wicket!', timestamp: Date.now() },
        { over: '15.1', text: 'Single taken, good running between the wickets.', timestamp: Date.now() - 30000 },
      ],
      winProbability: { home: 0.38, away: 0.62 },
    },
  });

  // Betting markets
  const matchWinner = await prisma.market.create({
    data: {
      matchId: liveMatch.id,
      name: 'Match Winner',
      type: MarketType.MATCH_WINNER,
      selections: {
        create: [
          { name: 'Mumbai Indians', odds: 2.15 },
          { name: 'Chennai Super Kings', odds: 1.72 },
        ],
      },
    },
    include: { selections: true },
  });

  await prisma.market.create({
    data: {
      matchId: liveMatch.id,
      name: 'Next Over Runs',
      type: MarketType.OVER_RUNS,
      metadata: { over: 16 },
      selections: {
        create: [
          { name: 'Over 8.5 Runs', odds: 1.85 },
          { name: 'Under 8.5 Runs', odds: 1.95 },
        ],
      },
    },
  });

  // Players for fantasy
  const players = ['Rohit Sharma', 'MS Dhoni', 'Virat Kohli', 'Jadeja', 'Bumrah', 'Hardik Pandya'];
  for (const [i, name] of players.entries()) {
    await prisma.player.create({
      data: {
        name,
        teamId: i % 2 === 0 ? 'MI' : 'CSK',
        role: i < 3 ? 'BAT' : i < 5 ? 'AR' : 'BOWL',
        credits: 8 + (i % 3),
        sportType: SportType.CRICKET,
        stats: { runs: 200 + i * 50, wickets: i * 2 },
      },
    });
  }

  // Fantasy contest
  await prisma.fantasyContest.create({
    data: {
      matchId: liveMatch.id,
      name: 'IPL Mega Contest',
      type: ContestType.MEGA,
      entryFee: 49,
      prizePool: 1000000,
      maxEntries: 50000,
      currentEntries: 12450,
      prizeBreakdown: { '1': 200000, '2-10': 50000, '11-100': 5000 },
      startsAt: liveMatch.startTime,
    },
  });

  // Prediction markets
  await prisma.predictionMarket.createMany({
    data: [
      {
        title: 'Will CSK win IPL 2026?',
        description: 'Resolves YES if Chennai Super Kings win the tournament',
        category: 'Cricket',
        yesPrice: 0.42,
        noPrice: 0.58,
        volume: 250000,
        resolvesAt: new Date('2026-06-01'),
      },
      {
        title: 'Will India win T20 World Cup 2026?',
        category: 'Cricket',
        yesPrice: 0.65,
        noPrice: 0.35,
        volume: 500000,
        resolvesAt: new Date('2026-11-15'),
      },
      {
        title: 'Will Messi score 20+ goals this season?',
        category: 'Football',
        yesPrice: 0.78,
        noPrice: 0.22,
        volume: 120000,
        resolvesAt: new Date('2026-05-30'),
      },
    ],
  });

  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sportstrike.com' },
    update: {},
    create: {
      email: 'admin@sportstrike.com',
      displayName: 'Admin',
      role: 'ADMIN',
      isVerified: true,
      referralCode: 'ADMIN001',
      passwordHash: '$2b$10$placeholder', // bcrypt hash in real deploy
    },
  });

  await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id, balance: 100000, bonusBalance: 5000 },
  });

  // Demo user
  const demo = await prisma.user.upsert({
    where: { email: 'demo@sportstrike.com' },
    update: {},
    create: {
      email: 'demo@sportstrike.com',
      displayName: 'Demo Player',
      isVerified: true,
      referralCode: 'DEMO2026',
      passwordHash: '$2b$10$placeholder',
    },
  });

  await prisma.wallet.upsert({
    where: { userId: demo.id },
    update: {},
    create: { userId: demo.id, balance: 10000, bonusBalance: 500 },
  });

  console.log('✅ Seed complete');
  console.log(`   Live match: ${liveMatch.id}`);
  console.log(`   Markets: ${matchWinner.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
