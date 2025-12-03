import { Module } from '@nestjs/common';
import { MealLogService } from './meal-log.service';
import { MealLogController } from './meal-log.controller';

@Module({
  imports: [], // Không cần import PrismaModule nếu nó là @Global()
  controllers: [MealLogController],
  providers: [MealLogService],
})
export class MealLogModule {}
