import { Controller, Post, Body, Get, Query, UseGuards, Req, Put } from '@nestjs/common';
import { WaterService } from './water.service';
import { CreateWaterLogDto } from './dto/create-water-log.dto';
import { UpdateWaterGoalDto } from './dto/update-water-goal.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('water')
export class WaterController {
  constructor(private readonly waterService: WaterService) {}

  @Post('logs')
  createLog(@Body() dto: CreateWaterLogDto, @Req() req) {
    const userId = req.user.id;
    return this.waterService.createLog(userId, dto);
  }

  @Get('logs')
  findLogs(@Query('date') date: string, @Req() req) {
    const userId = req.user.id;
    return this.waterService.findLogsByDate(userId, date);
  }

  @Put('goal')
  setGoal(@Body() dto: UpdateWaterGoalDto, @Req() req) {
    const userId = req.user.id;
    return this.waterService.setGoal(userId, dto);
  }

  @Get('summary')
  summary(@Query('date') date: string, @Req() req) {
    const userId = req.user.id;
    return this.waterService.getSummary(userId, date);
  }
}
