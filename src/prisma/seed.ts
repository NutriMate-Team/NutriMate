import { PrismaClient } from '@prisma/client';
import { exerciseSeedData } from './seeds/exercises.seed';
import { userSeedData } from './seeds/users.seed';
import { userProfileSeedData } from './seeds/user-profile.seed';
import * as bcrypt from 'bcrypt';

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const prisma = new PrismaClient();

const toFloat = (value: string | undefined): number | undefined => {
  if (!value || value.trim() === '') return undefined;
  const num = parseFloat(value.replace(',', '.'));
  return isNaN(num) ? undefined : num;
};

async function main() {
  console.log('🌱 Seeding...');

  // ================= USERS =================
  const rawUsers = await userSeedData();
  const users: any[] = [];

  for (const user of rawUsers) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });

    const passwordHash = await bcrypt.hash(user.passwordHash, 10);
    const userData = { ...user, passwordHash };

    if (existing) {
      const updated = await prisma.user.update({
        where: { email: user.email },
        data: userData,
      });
      users.push(updated);
    } else {
      const created = await prisma.user.create({ data: userData });
      users.push(created);
    }
  }

  console.log('👤 Users done');

  // ================= PROFILE =================
  for (let i = 0; i < users.length; i++) {
    const profile = userProfileSeedData[i];

    const bmi =
      profile.weightKg && profile.heightCm
        ? parseFloat(
            (
              profile.weightKg /
              Math.pow(profile.heightCm / 100, 2)
            ).toFixed(2),
          )
        : undefined;

    await prisma.userProfile.upsert({
      where: { userId: users[i].id },
      update: { ...profile, bmi },
      create: { ...profile, bmi, userId: users[i].id },
    });
  }

  console.log('📋 Profiles done');

  // ================= EXERCISE =================
  for (const ex of exerciseSeedData) {
    await prisma.exercise.upsert({
      where: { name: ex.name },
      update: ex,
      create: ex,
    });
  }

  console.log('🏋️ Exercises done');

  // ================= FOOD =================
  console.log('🥗 Seeding Foods...');
  await new Promise<void>((resolve, reject) => {
    const results: any[] = [];

    fs.createReadStream(path.join(__dirname, 'foods_vn.csv'))
      .pipe(csv({ skipLines: 2 }))
      .on('data', (d) => results.push(d))
      .on('end', async () => {
        for (const food of results) {
          const name = food['TÊN THỨC ĂN'];
          if (!name) continue;

          const data = {
            name,
            unit: '100g',
            source: 'vietnam_nin',
            calories: toFloat(food.Calories),
            protein: toFloat(food.Protein),
            fat: toFloat(food.Fat),
            carbs: toFloat(food.Carbonhydrates),
          };

          const existing = await prisma.food.findFirst({
            where: { name },
          });

          if (existing) {
            await prisma.food.update({
              where: { id: existing.id },
              data,
            });
          } else {
            await prisma.food.create({ data });
          }
        }
        resolve();
      })
      .on('error', reject);
  });

  console.log('🥗 Foods done');

  // ================= EXTRA DATA =================

  const foods = await prisma.food.findMany({ take: 3 });
  const exercises = await prisma.exercise.findMany({ take: 3 });

  console.log('🍽️ MealLogs...');
  for (const user of users) {
    for (const food of foods) {
      await prisma.mealLog.create({
        data: {
          userId: user.id,
          foodId: food.id,
          quantity: 150,
          mealType: 'LUNCH',
          totalCalories: ((food.calories || 0) / 100) * 150,
        },
      });
    }
  }

  console.log('📸 MealPhotos...');
  const mealLogs = await prisma.mealLog.findMany({ take: 3 });

  for (const log of mealLogs) {
    await prisma.mealPhoto.create({
      data: {
        userId: log.userId,
        mealLogId: log.id,
        filename: `photo_${log.id}.jpg`,
        path: `/uploads/meal-photos/photo_${log.id}.jpg`,
        status: 'PROCESSED',
        suggestedName: 'Cơm gà',
        suggestedCalories: 500,
        confidence: 0.9,
      },
    });
  }

  console.log('🧠 Recommendation...');
  for (const user of users) {
    await prisma.recommendation.upsert({
      where: { userId: user.id },
      update: {
        recommendedCalories: 2000,
        recommendedProtein: 120,
        recommendedFat: 60,
        recommendedCarbs: 250,
        recommendedExercise: 'Running',
      },
      create: {
        userId: user.id,
        recommendedCalories: 2000,
        recommendedProtein: 120,
        recommendedFat: 60,
        recommendedCarbs: 250,
        recommendedExercise: 'Running',
      },
    });
  }

  console.log('💧 Water...');
  for (const user of users) {
    await prisma.waterGoal.upsert({
      where: { userId: user.id },
      update: { dailyGoalMl: 2000 },
      create: { userId: user.id, dailyGoalMl: 2000 },
    });

    await prisma.waterLog.create({
      data: { userId: user.id, amountMl: 500 },
    });
  }

  console.log('🏋️ WorkoutLogs...');
  for (const user of users) {
    for (const ex of exercises) {
      await prisma.workoutLog.create({
        data: {
          userId: user.id,
          exerciseId: ex.id,
          durationMin: 30,
          caloriesBurned: ex.caloriesBurnedPerHour * 0.5,
        },
      });
    }
  }

  console.log('✅ DONE');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());