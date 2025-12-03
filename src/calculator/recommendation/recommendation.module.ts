import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { HealthModule } from '../health/health.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HealthModule, PrismaModule],
  controllers: [RecommendationController],
  providers: [RecommendationService],

  exports: [RecommendationService],
})
export class RecommendationModule {}
