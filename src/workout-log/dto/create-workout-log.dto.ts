import { IsNumber, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateWorkoutLogDto {
    @IsNotEmpty()
    @IsUUID()
    userId!: string;

    @IsNotEmpty()
    @IsUUID() 
    exerciseId!: string; 

    @IsNumber()
    durationMin!: number; 

    @IsNumber()
    caloriesBurned!: number; 

    @IsOptional()
    @IsNumber()
    totalCaloriesBurned?: number;
}