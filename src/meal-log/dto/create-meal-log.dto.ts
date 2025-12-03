import {
  IsNumber,
  IsNotEmpty,
  IsString,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateMealLogDto {
  @IsString({ message: 'foodId phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'foodId không được để trống.' })
  foodId!: string;

  @IsNumber({}, { message: 'Số lượng phải là một con số.' })
  @Min(0.1, { message: 'Số lượng phải lớn hơn 0.' })
  quantity!: number;

  @IsNotEmpty({ message: 'Loại bữa ăn không được để trống.' })
  @IsString()
  mealType!: string;

  @IsOptional()
  @IsString()
  source?: string; // 'usda' | 'openfoodfacts' | 'local'

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  calories?: number;

  @IsOptional()
  @IsNumber()
  protein?: number;

  @IsOptional()
  @IsNumber()
  fat?: number;

  @IsOptional()
  @IsNumber()
  carbs?: number;
}
