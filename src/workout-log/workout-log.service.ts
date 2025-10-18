import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { UpdateWorkoutLogDto } from './dto/update-workout-log.dto';
import { PrismaService } from 'src/prisma/prisma.services'; 

@Injectable()
export class WorkoutLogService {
  constructor(private prisma: PrismaService) {}

  // POST: Tạo một nhật ký tập luyện mới
  async create(createWorkoutLogDto: CreateWorkoutLogDto) {
    const { exerciseId, durationMin, ...rest } = createWorkoutLogDto;

    const exercise = await this.prisma.exercise.findUnique({
        where: { id: exerciseId },
        select: { caloriesBurnedPerHour: true } 
    });

    if (!exercise) {
        throw new NotFoundException(`Exercise with ID ${exerciseId} not found.`);
    }

    // Calories Burned = Calories per hour * (Minutes Time / 60)
    const totalCaloriesBurned = (exercise.caloriesBurnedPerHour / 60) * durationMin;


    return this.prisma.workoutLog.create({
      data: { ...rest, exerciseId, durationMin, totalCaloriesBurned: totalCaloriesBurned },
    });
  }

  // GET: Lấy tất cả nhật ký tập luyện
  findAll() {
    return this.prisma.workoutLog.findMany();
  }

  // GET /:id: Lấy một nhật ký cụ thể
  findOne(id: string) {
    return this.prisma.workoutLog.findUnique({
      where: { id },
    });
  }

  // PATCH /:id: Cập nhật nhật ký
  update(id: string, updateWorkoutLogDto: UpdateWorkoutLogDto) {
    return this.prisma.workoutLog.update({
      where: { id },
      data: updateWorkoutLogDto,
    });
  }

  // DELETE /:id: Xóa nhật ký
  remove(id: string) {
    return this.prisma.workoutLog.delete({
      where: { id },
    });
  }
}