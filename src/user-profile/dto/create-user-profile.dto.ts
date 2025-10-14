import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserProfileDto {
  @IsUUID()
  userId!: string;

  @IsOptional()
  @IsNumber()
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  targetWeightKg?: number;

  @IsOptional()
  @IsString()
  activityLevel?: string;

  @IsOptional()
  @IsNumber()
  bmi?: number;
}
