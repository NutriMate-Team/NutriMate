import { IsNumber, IsNotEmpty, IsUUID } from 'class-validator';

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
}