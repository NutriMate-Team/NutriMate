import { Module } from '@nestjs/common';
import { DashBoardController } from './dashboard.controller';
import { DashBoardService } from './dashboard.service';

@Module({
  imports: [],
  controllers: [DashBoardController],
  providers: [DashBoardService],
  exports: [DashBoardService],
})
export class DashboardModule {}
