import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMealLogDto } from './dto/create-meal-log.dto';
import { UpdateMealLogDto } from './dto/update-meal-log.dto';
import { PrismaService } from 'src/prisma/prisma.services'; 

@Injectable()
export class MealLogService {
  constructor(private prisma: PrismaService) {}

  // POST: Tạo một nhật ký bữa ăn mới
  async create(createMealLogDto: CreateMealLogDto) {
    const { foodId, quantity, ...rest } = createMealLogDto;

    // find food information
    const food = await this.prisma.food.findUnique({
      where: { id: foodId },
      select: { calories: true }
    });

    if(!food) {
      throw new NotFoundException(`Food with ID ${foodId} not found.`);
    }

    // Calories Calculate
    const calculatedCalories = (food.calories / 100) * quantity;    


    return this.prisma.mealLog.create({
      data: { ...rest, foodId, quantity, totalCalories: calculatedCalories,},
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