import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateFoodDto {
    @IsString()
    name!: string;
    
    @IsNumber()
    calories!: number;

    @IsOptional()
    @IsNumber()
    protein?: number;

    @IsOptional()
    @IsNumber()
    carbs?: number;

    @IsOptional()
    @IsNumber()
    fat?: number;

    @IsOptional()
    @IsString()
    portionSize?: string;
}