import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.services';
import { HealthService } from '../health/health.service';
import dayjs from 'dayjs';
import { ActivityLevel } from '@prisma/client';

@Injectable()
export class RecommendationService {
  constructor(
    private prisma: PrismaService,
    private healthService: HealthService,
  ) {}

  // calculate and create/update recommendation calories for user
  async generateRecommendation(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (
      !user ||
      !user.profile ||
      !user.dateOfBirth ||
      !user.profile.activityLevel
    ) {
      throw new NotFoundException('Dữ liệu hồ sơ không đầy đủ để tạo gợi ý.');
    }

    const profile = user.profile;

    const age = dayjs().diff(dayjs(user.dateOfBirth), 'year');
    const bmr = this.healthService.calculateBMR(
      user.gender as string,
      profile.weightKg as number,
      profile.heightCm as number,
      age,
    );

    const tdee = this.healthService.calculateTDEE(
      bmr,
      profile.activityLevel as ActivityLevel,
    );

    const targetCalories = tdee - 500; // Calo mục tiêu

    const existingRec = await this.prisma.recommendation.findFirst({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
    });

    return this.prisma.recommendation.upsert({
      where: { id: existingRec?.id || 'non-existing-id-to-force-create' },
      
      update: {
        recommendedCalories: targetCalories,
        generatedAt: new Date(),
      },
      
      create: {
        userId: userId,
        recommendedCalories: targetCalories,
        recommendedExercise: 'Bắt đầu với 30 phút Cardio mỗi ngày.',
      },
    });

  }

  // Lấy gợi ý mới nhất
  async findLatestRecommendation(userId: string) {
    return this.prisma.recommendation.findFirst({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
    });
  }
}