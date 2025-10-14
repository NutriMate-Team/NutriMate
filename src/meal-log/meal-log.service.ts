import { Injectable } from '@nestjs/common';
import { CreateMealLogDto } from './dto/create-meal-log.dto';
import { UpdateMealLogDto } from './dto/update-meal-log.dto';
import { PrismaService } from 'src/prisma/prisma.services'; 

@Injectable()
export class MealLogService {
  constructor(private prisma: PrismaService) {}

  // POST: Tạo một nhật ký bữa ăn mới
  create(createMealLogDto: CreateMealLogDto) {
    return this.prisma.mealLog.create({
      data: createMealLogDto,
    });
  }

  // GET: Lấy tất cả nhật ký bữa ăn
  findAll() {
    return this.prisma.mealLog.findMany();
  }

  // GET /:id: Lấy một nhật ký cụ thể
  findOne(id: string) {
    return this.prisma.mealLog.findUnique({
      where: { id },
    });
  }

  // PATCH /:id: Cập nhật nhật ký
  update(id: string, updateMealLogDto: UpdateMealLogDto) {
    return this.prisma.mealLog.update({
      where: { id },
      data: updateMealLogDto,
    });
  }

  // DELETE /:id: Xóa nhật ký
  remove(id: string) {
    return this.prisma.mealLog.delete({
      where: { id },
    });
  }
}