import { io, Socket } from 'socket.io-client';
import { WS_EVENTS } from '@sportstrike/shared';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

let socket: Socket | null = null;

export function getSocket(userId?: string): Socket {
  if (!socket) {
    socket = io(WS_URL, {
      auth: { userId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
    });
  }
  return socket;
}

export function joinMatchRoom(matchId: string) {
  getSocket().emit('join:match', matchId);
}

export function joinMarketRoom(marketId: string) {
  getSocket().emit('join:market', marketId);
}

export { WS_EVENTS };
