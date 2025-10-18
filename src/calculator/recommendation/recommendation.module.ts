import { Controller, Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { HealthModule } from '../health/health.module';

@Module({
    imports: [HealthModule],
    controllers: [RecommendationController],
    providers: [RecommendationService],
})
export class RecommendationModule {}