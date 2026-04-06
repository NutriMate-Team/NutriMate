import { IsInt, Min, IsBoolean, IsOptional, MinLength, Max, Min as MinValue } from 'class-validator';

export class UpdateWaterGoalDto {
  @IsInt({ message: 'dailyGoalMl phải là số nguyên (ml).' })
  @Min(1, { message: 'dailyGoalMl phải lớn hơn 0.' })
  dailyGoalMl!: number;

  @IsOptional()
  @IsBoolean()
  reminderEnabled?: boolean;

  @IsOptional()
  @IsInt()
  @MinValue(0)
  @Max(23)
  reminderHour?: number;

  @IsOptional()
  @IsInt()
  @MinValue(0)
  @Max(59)
  reminderMinute?: number;
}
