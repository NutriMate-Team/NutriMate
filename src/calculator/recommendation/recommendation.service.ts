import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.services';
import { HealthService } from '../health/health.service';
import dayjs from 'dayjs';

@Injectable()
export class RecommendationService {
    constructor(
        private prisma: PrismaService,
        private healthService: HealthService,
    ) {}

    // calculate and create/update recommendation calories for user
    async generateRecommendation(userId: string) {
        // get needed data for User and Profile
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });

        if (!user || !user.profile || !user.dateOfBirth || !user.profile.activityLevel) {
            throw new NotFoundException('User profile data required for recommendation.');
        }

        const profile = user.profile;

        // calculate stats
        const age = dayjs().diff(dayjs(user.dateOfBirth), 'year');
        const bmr = this.healthService.calculateBMR(
            user.gender as string,
            profile.weightKg as number,
            profile.heightCm as number,
            age
        );

        const tdee = this.healthService.calculateTDEE(bmr, profile.activityLevel || 'sedentary' as string);

        // calculate Calories Target
        const targetCalories = tdee - 500;

        // Save/Update Recommendation record
        const existingRec = await this.prisma.recommendation.findFirst({
            where: { userId },
            orderBy: { generatedAt: 'desc' },
        });

        // create new or update recommendation
        return this.prisma.recommendation.upsert({
            where: { id: existingRec?.id || 'non-existing-id' },
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

    async findLatestRecommendation(userId: string) {
        return this.prisma.recommendation.findFirst({
            where: { userId },
            orderBy: { generatedAt: 'desc' },
        });
    }
}