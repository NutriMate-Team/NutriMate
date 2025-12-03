import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class HealthService {
  // calculator age for BMR (needed)
  private calculateAge(dateOfBirth: Date): number {
    return dayjs().diff(dayjs(dateOfBirth), 'year');
  }

  // calculator BMI (Body Mass Index)
  // W (kg) / [H (m)]^2
  calculateBMI(heightCm: number, weightKg: number): number {
    if (heightCm <= 0 || weightKg <= 0) return 0;
    const heightM = heightCm / 100; // change value from Centimeter to Meter
    const bmi = weightKg / (heightM * heightM);
    return parseFloat(bmi.toFixed(2));
  }

  // calculator BMR ((Basal Metabolic Rate)
  // Mifflin-St Jeor recipe
  calculateBMR(
    gender: string,
    weightKg: number,
    heightCm: number,
    age: number,
  ): number {
    let bmr: number;
    if (gender == 'Male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 + heightCm - 5 * age - 161;
    }

    return Math.round(bmr);
  }

  // calculator TDEE (Total Daily Energy Expenditure)
  calculateTDEE(bmr: number, activityLevel: string): number {
    let multiplier: number;

    switch (activityLevel.toLowerCase()) {
      case 'sedentary':
        multiplier = 1.2;
        break;
      case 'light':
        multiplier = 1.375;
        break;
      case 'moderate':
        multiplier = 1.55;
        break;
      case 'active':
        multiplier = 1.725;
        break;
      case 'very-active':
        multiplier = 1.9;
        break;
      default:
        multiplier = 1.2;
    }

    return Math.round(bmr * multiplier);
  }
}
