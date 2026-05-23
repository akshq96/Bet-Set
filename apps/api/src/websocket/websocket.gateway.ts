import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WS_EVENTS } from '@sportstrike/shared';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/',
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId;
    if (userId) {
      if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
      this.userSockets.get(userId)!.add(client.id);
      client.join(`user:${userId}`);
    }
    console.log(`🔌 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) this.userSockets.delete(userId);
    }
  }

  @SubscribeMessage('join:match')
  handleJoinMatch(client: Socket, matchId: string) {
    client.join(`match:${matchId}`);
    return { event: 'joined', matchId };
  }

  @SubscribeMessage('join:market')
  handleJoinMarket(client: Socket, marketId: string) {
    client.join(`market:${marketId}`);
    return { event: 'joined', marketId };
  }

  @SubscribeMessage('chat:send')
  handleChat(client: Socket, payload: { matchId: string; message: string; userId: string; displayName: string }) {
    this.server.to(`match:${payload.matchId}`).emit(WS_EVENTS.CHAT_MESSAGE, {
      ...payload,
      timestamp: Date.now(),
    });
  }

  emitToUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  emitOddsUpdate(data: { selectionId: string; marketId: string; odds: number; timestamp: number }) {
    this.server.to(`market:${data.marketId}`).emit(WS_EVENTS.ODDS_UPDATE, data);
  }

  emitMatchScore(matchId: string, score: unknown) {
    this.server.to(`match:${matchId}`).emit(WS_EVENTS.MATCH_SCORE, score);
  }

  emitPredictionPrice(marketId: string, data: unknown) {
    this.server.emit(WS_EVENTS.PREDICTION_PRICE, { marketId, ...data as object });
  }

  emitFantasyLeaderboard(contestId: string, leaderboard: unknown[]) {
    this.server.emit(WS_EVENTS.FANTASY_LEADERBOARD, { contestId, leaderboard });
  }
}
