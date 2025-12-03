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

    // 1. Tính BMR (Basal Metabolic Rate)
    const bmr = this.healthService.calculateBMR(
      user.gender as string,
      profile.weightKg as number,
      profile.heightCm as number,
      age,
    );

    // 2. Tính TDEE (Total Daily Energy Expenditure)
    const tdee = this.healthService.calculateTDEE(
      bmr,
      profile.activityLevel as ActivityLevel,
    );

    // 3. Tính Calo Mục tiêu (Target Calories)
    let targetCalories = tdee;
    let exerciseSuggestion = 'Duy trì thói quen luyện tập để giữ cân.';

    if (profile.targetWeightKg) {
      const diff = profile.targetWeightKg - (profile.weightKg || 0);

      // Ngưỡng chênh lệch nhỏ (ví dụ 0.5kg) coi như đã đạt mục tiêu
      if (Math.abs(diff) < 0.5) {
        targetCalories = tdee;
        exerciseSuggestion = 'Bạn đã đạt cân nặng mục tiêu! Hãy duy trì.';
      } else if (diff > 0) {
        // MUỐN TĂNG CÂN -> ĂN DƯ (Surplus)
        // Tăng 500 kcal/ngày
        targetCalories = tdee + 500;
        exerciseSuggestion =
          'Tập luyện sức mạnh (Gym) kết hợp ăn dư calo để tăng cơ.';
      } else {
        // MUỐN GIẢM CÂN -> ĂN THÂM HỤT (Deficit)
        // Giảm 500 kcal/ngày
        targetCalories = tdee - 500;
        exerciseSuggestion = 'Kết hợp Cardio và giảm calo để đốt mỡ hiệu quả.';
      }
    }

    // 4. [QUAN TRỌNG] Giới hạn an toàn
    // Không bao giờ để targetCalories xuống dưới BMR (mức tối thiểu để sống)
    if (targetCalories < bmr) {
      targetCalories = bmr;
    }

    // Tìm bản ghi cũ
    const existingRec = await this.prisma.recommendation.findFirst({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
    });

    // 5. Lưu vào DB
    return this.prisma.recommendation.upsert({
      where: { id: existingRec?.id || 'non-existing-id-to-force-create' },

      update: {
        recommendedCalories: parseFloat(targetCalories.toFixed(2)),
        recommendedExercise: exerciseSuggestion,
        generatedAt: new Date(),
      },

      create: {
        userId: userId,
        recommendedCalories: parseFloat(targetCalories.toFixed(2)),
        recommendedExercise: exerciseSuggestion,
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
