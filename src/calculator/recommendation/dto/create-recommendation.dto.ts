import { IsUUID, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRecommendationDto {
  // Yêu cầu: ID của người dùng (Bắt buộc)
  @IsUUID()
  userId!: string;

  // Yêu cầu: Calories đề xuất (Number)
  @IsNumber()
  recommendedCalories!: number;

  // Tùy chọn: Đề xuất bài tập cụ thể
  @IsOptional()
  @IsString()
  recommendedExercise?: string;

  // GenerateAt auto add by Prisma
}
