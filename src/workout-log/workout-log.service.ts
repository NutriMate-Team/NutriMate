import { Injectable } from '@nestjs/common';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { UpdateWorkoutLogDto } from './dto/update-workout-log.dto';
import { PrismaService } from 'src/prisma/prisma.services'; 

@Injectable()
export class WorkoutLogService {
  constructor(private prisma: PrismaService) {}

  // POST: Tạo một nhật ký tập luyện mới
  create(createWorkoutLogDto: CreateWorkoutLogDto) {
    // Prisma tự động xử lý các mối quan hệ (userId, exerciseId)
    return this.prisma.workoutLog.create({
      data: createWorkoutLogDto,
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