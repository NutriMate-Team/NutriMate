import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { CreateMealLogDto } from './dto/create-meal-log.dto';
import { UpdateMealLogDto } from './dto/update-meal-log.dto';
import { PrismaService } from 'src/prisma/prisma.services';

@Injectable()
export class MealLogService {
  private readonly logger = new Logger(MealLogService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateMealLogDto) {
    const { 
      foodId, quantity, mealType, 
      source, name, calories 
    } = dto;

    let localFoodId = foodId;
    let foodCalorie100g = 0;

    if (source === 'usda' || source === 'openfoodfacts') {
      this.logger.log('🌍 Phát hiện nguồn USDA/OpenFoodFacts');

      // 1. Kiểm tra dữ liệu bắt buộc
      if (!name || calories === undefined) {
        throw new BadRequestException('Thiếu thông tin: name và calories là bắt buộc với món USDA.');
      }

      // 2. Tìm trong DB xem đã lưu chưa
      const existingFood = await this.prisma.food.findFirst({
        where: { externalId: foodId.toString(), source: source }
      });

      if (existingFood) {
        this.logger.log(`✅ Đã có món này trong DB (ID: ${existingFood.id})`);
        localFoodId = existingFood.id;
        foodCalorie100g = existingFood.calories ?? 0;
      } else {
        this.logger.log(`🆕 Chưa có, đang tạo món mới...`);
        const newFood = await this.prisma.food.create({
          data: {
            name: name,
            source: source,
            externalId: foodId.toString(),
            unit: '100g',
            calories: Number(calories) || 0,
            protein: Number(dto.protein) || 0,
            fat: Number(dto.fat) || 0,
            carbs: Number(dto.carbs) || 0,
          }
        });
        localFoodId = newFood.id;
        foodCalorie100g = newFood.calories ?? 0;
      }
    } 

    else {
      this.logger.log('🏠 Tìm kiếm món ăn Local');
      const localFood = await this.prisma.food.findUnique({
        where: { id: foodId },
      });

      if (!localFood) {
        throw new NotFoundException(`Không tìm thấy món ăn ID: ${foodId}`);
      }
      localFoodId = localFood.id;
      foodCalorie100g = localFood.calories ?? 0;
    }

    // Tính toán và lưu
    const totalCalories = (foodCalorie100g / 100) * quantity;

    return this.prisma.mealLog.create({
      data: {
        userId: userId,
        foodId: localFoodId,
        quantity: quantity,
        mealType: mealType,
        totalCalories: parseFloat(totalCalories.toFixed(2)),
      },
      include: { food: true }
    });
  }

  findAll(userId: string) {
    return this.prisma.mealLog.findMany({
      where: { userId },
      include: { food: true },
      orderBy: { loggedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const log = await this.prisma.mealLog.findFirst({ where: { id, userId }, include: { food: true } });
    if (!log) throw new NotFoundException(`Meal log not found.`);
    return log;
  }

  async update(id: string, userId: string, updateMealLogDto: UpdateMealLogDto) {
    await this.findOne(id, userId);
    return this.prisma.mealLog.update({ where: { id }, data: updateMealLogDto });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.mealLog.delete({ where: { id } });
  }
}