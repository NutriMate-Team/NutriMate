import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExerciseModule } from './exercise/exercise.module';
import { FoodModule } from './food/food.module';
import { UserModule } from './user/user.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { WorkoutLogModule } from './workout-log/workout-log.module';
import { MealLogModule } from './meal-log/meal-log.module';

@Module({
  imports: [PrismaModule, FoodModule, ExerciseModule, UserModule, UserProfileModule, WorkoutLogModule, MealLogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
