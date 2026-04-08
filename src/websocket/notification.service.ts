import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class NotificationService {
  private server!: Server;

  setServer(server: Server) {
    this.server = server;
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server?.to(`user_${userId}`).emit(event, data);
  }

  emitReminder(userId: string, message: string) {
    this.emitToUser(userId, 'water-reminder', {
      message,
      timestamp: new Date().toISOString(),
    });
  }
}