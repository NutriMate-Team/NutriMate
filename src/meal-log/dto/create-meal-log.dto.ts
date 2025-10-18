import { IsNumber, IsNotEmpty, IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateMealLogDto {
    @IsNotEmpty()
    @IsUUID()
    userId!: string;

    @IsNotEmpty()
    @IsUUID()
    foodId!: string;

    @IsNumber()
    quantity!: number;

    @IsNotEmpty()
    @IsString()
    mealType!: string;

    @IsOptional()
    @IsNumber()
    totalCalories?: number;
}