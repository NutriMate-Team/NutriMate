import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { NotificationService } from './notification.service';

@Module({
  providers: [WebsocketGateway, NotificationService],
  exports: [NotificationService],
})
export class WebsocketModule {}

