import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExerciseModule } from './exercise/exercise.module';
import { FoodModule } from './food/food.module';
import { UserModule } from './user/user.module';
import { UserProfileModule } from './user-profile/user-profile.module';

@Module({
  imports: [PrismaModule, FoodModule, ExerciseModule, UserModule, UserProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
