import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server!: Server;

  constructor(private notificationService: NotificationService) {}

  afterInit(server: Server) {
    this.notificationService.setServer(server);
  }

  async handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId;

    if (userId) {
      client.join(`user_${userId}`);
      console.log(`[WS] ${client.id} joined user_${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[WS] ${client.id} disconnected`);
  }

  @SubscribeMessage('join-room')
  joinRoom(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`user_${data.userId}`);
    client.emit('joined-room', { success: true });
  }
}