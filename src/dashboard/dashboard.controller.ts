import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashBoardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashBoardController {
    constructor(private readonly dashboardService: DashBoardService) {}

    @Get('summary')
    async getSummary(
        @Request() req: any,
        @Query('date') dateString?: string
    ) {
        const userId = req.user.id;
        const date = dateString ? new Date(dateString) : new Date();
        return this.dashboardService.getDailySummary(userId, date);
    }
}