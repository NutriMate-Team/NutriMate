import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecommendationService } from './recommendation.service';

@Controller('recommendation')
@UseGuards(AuthGuard('jwt'))
export class RecommendationController {
    constructor(private readonly recommendationService: RecommendationService) {}

    // Route for create or calculate recommendation
    @Get('generate')
    async generate(@Request() req: any) {
        // get User ID form JWT PayLoad (req.user got help from JwtStrategy)
        const userId = req.user.id;
        return this.recommendationService.generateRecommendation(userId);
    }

    // Route get latest recommendation
    @Get('latest')
    async findLatest(@Request() req: any) {
        const userId = req.user.id;
        return this.recommendationService.findLatestRecommendation(userId);
    }
}