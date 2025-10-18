import { Controller, Get, Query } from "@nestjs/common";
import { HealthService } from "./health.service";

@Controller('health-metrics')
export class HealthController {
    constructor(private readonly healthService : HealthService) {}

    // Route example to test BMI calculator
    @Get('bmi')
    calculatorBMI(
        @Query('height') height: string,
        @Query('wieght') weight: string,
    ) {
        const heightCm = parseFloat(height);
        const weightKg = parseFloat(weight);
        if(isNaN(heightCm) || isNaN(weightKg)) return { error: 'Invalid number' };
        return { bmi: this.healthService.calculateBMI(heightCm, weightKg) };
    }
}