import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RecommendationModule } from 'src/calculator/recommendation/recommendation.module'; // <-- 1. IMPORT MODULE GỢI Ý

@Module({
  imports: [PrismaModule, RecommendationModule],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
