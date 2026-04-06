import { Injectable } from '@nestjs/common';
import { basename } from 'path';

@Injectable()
export class RecognitionService {
  private foods = [
    { name: 'Phở', keywords: ['pho', 'phở'], calories: 450 },
    { name: 'Cơm Tấm', keywords: ['com', 'cơm'], calories: 700 },
    { name: 'Gỏi Cuốn', keywords: ['goi', 'gỏi', 'cuon'], calories: 200 },
    { name: 'Bún Bò', keywords: ['bun', 'bún', 'bo', 'bò'], calories: 600 },
    { name: 'Salad', keywords: ['salad'], calories: 220 },
  ];

  async recognize(filePath: string) {
    const name = basename(filePath).toLowerCase();
    for (const f of this.foods) {
      for (const k of f.keywords) {
        if (name.includes(k)) {
          return { name: f.name, calories: f.calories, confidence: 0.85 };
        }
      }
    }
    const randomCalories = Math.floor(250 + Math.random() * 700);
    return { name: 'Unknown Dish', calories: randomCalories, confidence: 0.45 };
  }
}
