/** Shared types across API and Web */

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export interface JwtPayload {
  sub: string;
  email?: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface LiveScore {
  innings: number;
  batting: string;
  score: string;
  overs: string;
  runRate: number;
  required?: number;
  ballsRemaining?: number;
  lastBall?: { runs: number; type: string };
}

export interface OddsUpdate {
  selectionId: string;
  marketId: string;
  odds: number;
  timestamp: number;
}

export interface BetSlipItem {
  selectionId: string;
  marketId: string;
  selectionName: string;
  marketName: string;
  odds: number;
  stake?: number;
}

export interface FantasyPlayer {
  id: string;
  name: string;
  role: string;
  credits: number;
  team: string;
  points?: number;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
}

/** WebSocket event names */
export const WS_EVENTS = {
  ODDS_UPDATE: 'odds:update',
  MATCH_SCORE: 'match:score',
  BET_RESULT: 'bet:result',
  WALLET_UPDATE: 'wallet:update',
  NOTIFICATION: 'notification',
  CHAT_MESSAGE: 'chat:message',
  MARKET_STATUS: 'market:status',
  PREDICTION_PRICE: 'prediction:price',
  FANTASY_LEADERBOARD: 'fantasy:leaderboard',
} as const;

export type WsEvent = (typeof WS_EVENTS)[keyof typeof WS_EVENTS];

/** Fantasy points calculation rules (Dream11-style) */
export const FANTASY_POINTS = {
  BAT: {
    run: 1,
    boundary: 1,
    six: 2,
    fifty: 8,
    hundred: 16,
    duck: -2,
  },
  BOWL: {
    wicket: 25,
    lbwBowled: 8,
    threeWicket: 4,
    fourWicket: 8,
    fiveWicket: 16,
    maiden: 12,
  },
  FIELD: {
    catch: 8,
    stumping: 12,
    runOut: 6,
  },
  CAPTAIN_MULTIPLIER: 2,
  VICE_CAPTAIN_MULTIPLIER: 1.5,
} as const;
