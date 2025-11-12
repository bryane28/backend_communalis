import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:4200')
      .split(',')
      .map((s) => s.trim()),
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  constructor(private readonly jwt: JwtService) {}

  handleConnection(client: any) {
    try {
      const token = this.extractToken(client);
      if (!token) return client.disconnect(true);
      const payload = this.jwt.verify(token);
      client.data.userId = payload.sub;
      client.data.role = payload.role;
      // Join per-user room
      if (payload.sub) client.join(`user:${payload.sub}`);
    } catch (e) {
      return client.disconnect(true);
    }
  }

  handleDisconnect(client: any) {}

  private extractToken(client: any): string | null {
    // Query param ?token=... or Authorization: Bearer ...
    const qToken = client?.handshake?.query?.token as string | undefined;
    if (qToken) return qToken;
    const auth = client?.handshake?.headers?.authorization as string | undefined;
    if (!auth) return null;
    const parts = auth.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') return parts[1];
    return null;
  }
}
