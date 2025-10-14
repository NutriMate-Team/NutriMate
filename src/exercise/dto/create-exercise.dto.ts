import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class CreateExerciseDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNumber()
    @IsNotEmpty()
    caloriesBurnedPerHour!: number;

    @IsString()
    @IsNotEmpty()
    type!: string;

}