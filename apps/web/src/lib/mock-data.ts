/** Client-side mock data when API is unavailable */

export const MOCK_LIVE_MATCH = {
  id: 'mock-live-1',
  status: 'LIVE',
  venue: 'Wankhede Stadium, Mumbai',
  homeTeam: { id: 'MI', name: 'Mumbai Indians', shortName: 'MI', logo: '🏏' },
  awayTeam: { id: 'CSK', name: 'Chennai Super Kings', shortName: 'CSK', logo: '🦁' },
  tournament: { name: 'IPL 2026', sport: { slug: 'cricket', icon: '🏏' } },
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
  winProbability: { home: 0.38, away: 0.62 },
  markets: [
    {
      id: 'm1',
      name: 'Match Winner',
      type: 'MATCH_WINNER',
      status: 'OPEN',
      selections: [
        { id: 's1', name: 'Mumbai Indians', odds: 2.15 },
        { id: 's2', name: 'Chennai Super Kings', odds: 1.72 },
      ],
    },
    {
      id: 'm2',
      name: 'Next Over Runs (16)',
      type: 'OVER_RUNS',
      status: 'OPEN',
      selections: [
        { id: 's3', name: 'Over 8.5', odds: 1.85 },
        { id: 's4', name: 'Under 8.5', odds: 1.95 },
      ],
    },
  ],
};

export const MOCK_PREDICTION_MARKETS = [
  {
    id: 'pm1',
    title: 'Will CSK win IPL 2026?',
    category: 'Cricket',
    yesPrice: 0.42,
    noPrice: 0.58,
    volume: 250000,
    resolvesAt: '2026-06-01',
  },
  {
    id: 'pm2',
    title: 'Will India win T20 World Cup 2026?',
    category: 'Cricket',
    yesPrice: 0.65,
    noPrice: 0.35,
    volume: 500000,
    resolvesAt: '2026-11-15',
  },
  {
    id: 'pm3',
    title: 'Will Haaland score 30+ PL goals?',
    category: 'Football',
    yesPrice: 0.78,
    noPrice: 0.22,
    volume: 120000,
    resolvesAt: '2026-05-30',
  },
];

export const MOCK_FANTASY_CONTESTS = [
  {
    id: 'fc1',
    name: 'IPL Mega Contest',
    type: 'MEGA',
    entryFee: 49,
    prizePool: 1000000,
    maxEntries: 50000,
    currentEntries: 12450,
    match: MOCK_LIVE_MATCH,
  },
  {
    id: 'fc2',
    name: 'Head to Head',
    type: 'HEAD_TO_HEAD',
    entryFee: 10,
    prizePool: 18,
    maxEntries: 2,
    currentEntries: 1,
    match: MOCK_LIVE_MATCH,
  },
];

export const TICKER_ITEMS = [
  '🔴 LIVE: CSK 142/4 (15.2) vs MI — CSK need 48 off 28',
  '⚡ Odds Update: CSK 1.72 → 1.68',
  '🏆 Mega Contest: ₹10L prize pool filling fast!',
  '⚽ Man City vs Arsenal kicks off in 2h',
  '📈 YES shares: CSK IPL win @ ₹0.42',
];
