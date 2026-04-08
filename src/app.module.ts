import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExerciseModule } from './exercise/exercise.module';
import { FoodModule } from './food/food.module';
import { UserModule } from './user/user.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { WorkoutLogModule } from './workout-log/workout-log.module';
import { MealLogModule } from './meal-log/meal-log.module';
import { MealPhotoModule } from './meal-photo/meal-photo.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WaterModule } from './water/water.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        // This setting prevents the server from looking for index.html
        index: false,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    FoodModule,
    ExerciseModule,
    UserModule,
    UserProfileModule,
    WorkoutLogModule,
    MealLogModule,
    MealPhotoModule,
    DashboardModule,
    WaterModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
