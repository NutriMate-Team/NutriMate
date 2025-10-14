import { IsNumber, IsNotEmpty, IsUUID, IsString } from 'class-validator';

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
}