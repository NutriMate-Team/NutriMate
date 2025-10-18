import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.services';
import dayjs from 'dayjs';

@Injectable()
export class DashBoardService {
    constructor(private prisma: PrismaService) {}

    // get all information in 1 day (today is a default)
    async getDailySummary(userId: string, date: Date = new Date()) {

        const startOfDay = dayjs(date).startOf('day').toDate();
        const endOfDay = dayjs(date).endOf('day').toDate();

        // [Logic Calories Consumed và Burned giữ nguyên]
        const mealLogs = await this.prisma.mealLog.findMany({ /* ... */ });
        const caloriesConsumed = mealLogs.reduce((sum, log) => sum + (log.totalCalories || 0), 0);

        const workoutLogs = await this.prisma.workoutLog.findMany({ /* ... */ });
        const caloriesBurned = workoutLogs.reduce((sum, log) => sum + (log.totalCaloriesBurned || 0), 0);
        
        // Tính Net Calories (đã được làm đúng ở trên)
        const netCalories = caloriesConsumed - caloriesBurned; 

        // get profile and give recommendation
        const profile = await this.prisma.userProfile.findUnique({ where: {userId} });
        const recommendation = await this.prisma.recommendation.findFirst({
            where: { userId },
            orderBy: { generatedAt: 'desc' },
        });
        
        // return to synthetic information
        return {
            date: dayjs(date).format('YYYY-MM-DD'),
            caloriesConsumed: parseFloat(caloriesConsumed.toFixed(2)),
            caloriesBurned: parseFloat(caloriesBurned.toFixed(2)),
            
            netCalories: parseFloat(netCalories.toFixed(2)), 
            
            // target infomation (if you have)
            targetCalories: recommendation?.recommendedCalories || null,

            // remaining calories
            remainingCalories: recommendation 
                ? parseFloat(((recommendation.recommendedCalories ?? 0) - netCalories).toFixed(2)) 
                : null,
            
            bmi: profile?.bmi || null,
        }
    }
}