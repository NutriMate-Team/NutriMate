import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.services';
import { CreateWaterLogDto } from './dto/create-water-log.dto';
import { UpdateWaterGoalDto } from './dto/update-water-goal.dto';

@Injectable()
export class WaterService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WaterService.name);
  private reminderTimer?: NodeJS.Timeout;

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Basic in-process reminder loop (non-persistent; suitable for simple reminders)
    this.reminderTimer = setInterval(() => this.checkReminders(), 60 * 1000);
    this.logger.log('Water reminder timer started.');
  }

  async onModuleDestroy() {
    if (this.reminderTimer) clearInterval(this.reminderTimer);
  }

  async createLog(userId: string, dto: CreateWaterLogDto) {
    const loggedAt = dto.loggedAt ? new Date(dto.loggedAt) : undefined;
    return this.prisma.waterLog.create({
      data: {
        userId,
        amountMl: dto.amountMl,
        loggedAt,
      },
    });
  }

  async findLogsByDate(userId: string, date?: string) {
    const target = date ? new Date(date) : new Date();
    const start = new Date(target);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return this.prisma.waterLog.findMany({
      where: {
        userId,
        loggedAt: { gte: start, lt: end },
      },
      orderBy: { loggedAt: 'desc' },
    });
  }

  async setGoal(userId: string, dto: UpdateWaterGoalDto) {
    const existing = await this.prisma.waterGoal.findFirst({ where: { userId } });
    if (existing) {
      return this.prisma.waterGoal.update({ where: { id: existing.id }, data: dto });
    }
    return this.prisma.waterGoal.create({ data: { userId, ...dto } });
  }

  async getSummary(userId: string, date?: string) {
    const goal = await this.prisma.waterGoal.findFirst({ where: { userId } });
    const logs = await this.findLogsByDate(userId, date);
    const total = logs.reduce((s, l) => s + l.amountMl, 0);
    const dailyGoal = goal?.dailyGoalMl ?? 2000; // fallback default
    const percent = Math.min(100, Math.round((total / dailyGoal) * 100));
    return { totalMl: total, dailyGoalMl: dailyGoal, percentCompleted: percent, logs, goal };
  }

  // Checks reminder settings and logs a message when a reminder would trigger.
  private async checkReminders() {
    try {
      const now = new Date();
      const goals = await this.prisma.waterGoal.findMany({ where: { reminderEnabled: true } });
      for (const g of goals) {
        if (g.reminderHour === null || g.reminderHour === undefined) continue;
        const rh = g.reminderHour ?? 0;
        const rm = g.reminderMinute ?? 0;
        if (now.getHours() === rh && now.getMinutes() === rm) {
          // Check whether user already logged something in the last hour
          const since = new Date(now.getTime() - 60 * 60 * 1000);
          const recent = await this.prisma.waterLog.findFirst({ where: { userId: g.userId, loggedAt: { gte: since } } });
          if (!recent) {
            this.logger.log(`Reminder: user ${g.userId} should drink water now.`);
          }
        }
      }
    } catch (err) {
      this.logger.error('Error checking water reminders', err as any);
    }
  }
}
