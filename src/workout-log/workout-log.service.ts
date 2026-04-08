import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { UpdateWorkoutLogDto } from './dto/update-workout-log.dto';
import { PrismaService } from 'src/prisma/prisma.services';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class WorkoutLogService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createWorkoutLogDto: CreateWorkoutLogDto) {
    const { exerciseId, durationMin } = createWorkoutLogDto;

    return this.prisma.withTransaction(async (tx: Prisma.TransactionClient) => {
      const exercise = await tx.exercise.findUnique({
        where: { id: exerciseId },
        select: { caloriesBurnedPerHour: true },
      });

      if (!exercise) {
        throw new NotFoundException(`Exercise with ID ${exerciseId} not found.`);
      }

      const totalCaloriesBurned =
        (exercise.caloriesBurnedPerHour / 60) * durationMin;

      return tx.workoutLog.create({
        data: {
          userId: userId,
          exerciseId: exerciseId,
          durationMin: durationMin,
          caloriesBurned: totalCaloriesBurned,
        },
        include: {
          exercise: true,
        },
      });
    });
  }

  findAll(userId: string) {
    return this.prisma.workoutLog.findMany({
      where: { userId: userId },
      orderBy: { loggedAt: 'desc' },
      include: {
        exercise: true,
      },
    });
  }

  // Get today's workout logs with exercise info
  async findTodayLogs(userId: string, date: Date = new Date()) {
    const startOfDay = dayjs(date).startOf('day').toDate();
    const endOfDay = dayjs(date).endOf('day').toDate();

    return this.prisma.workoutLog.findMany({
      where: {
        userId: userId,
        loggedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        exercise: true,
      },
      orderBy: { loggedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const log = await this.prisma.workoutLog.findFirst({
      where: { id: id, userId: userId },
    });

    if (!log) {
      throw new NotFoundException('Workout log not found.');
    }
    return log;
  }

  async update(
    id: string,
    userId: string,
    updateWorkoutLogDto: UpdateWorkoutLogDto,
  ) {
    return this.prisma.withTransaction(async (tx: Prisma.TransactionClient) => {
      const log = await tx.workoutLog.findFirst({
        where: { id, userId },
      });

      if (!log) {
        throw new NotFoundException('Workout log not found.');
      }

      return tx.workoutLog.update({
        where: { id: id },
        data: updateWorkoutLogDto,
      });
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.workoutLog.delete({
      where: { id: id },
    });
  }
}
