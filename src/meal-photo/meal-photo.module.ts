import { Module } from '@nestjs/common';
import { MealPhotoController } from './meal-photo.controller';
import { MealPhotoService } from './meal-photo.service';
import { QueueService } from './queue.service';
import { RecognitionService } from './recognition.service';

@Module({
  controllers: [MealPhotoController],
  providers: [MealPhotoService, QueueService, RecognitionService],
  exports: [MealPhotoService],
})
export class MealPhotoModule {}
