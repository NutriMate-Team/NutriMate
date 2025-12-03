import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('recommendation')
@UseGuards(JwtAuthGuard)
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('generate')
  async generate(@Req() req) {
    const userId = req.user.id;
    return this.recommendationService.generateRecommendation(userId);
  }

  @Get('latest')
  async findLatest(@Req() req) {
    const userId = req.user.id;
    return this.recommendationService.findLatestRecommendation(userId);
  }
}
