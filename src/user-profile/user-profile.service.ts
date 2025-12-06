// file: src/user-profile/user-profile.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.services';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { RecommendationService } from 'src/calculator/recommendation/recommendation.service';

@Injectable()
export class UserProfileService {
  constructor(
    private prisma: PrismaService,
    private recommendationService: RecommendationService,
  ) {}

  async updateProfile(userId: string, dto: UpdateUserProfileDto) {
    const { weightKg, heightCm, ...rest } = dto;

    let bmi: number | undefined = undefined;

    if (weightKg && heightCm) {
      const heightInMeters = heightCm / 100;
      bmi = parseFloat(
        (weightKg / (heightInMeters * heightInMeters)).toFixed(2),
      );
    }

    const updatedProfile = await this.prisma.userProfile.upsert({
      where: { userId: userId },
      create: {
        userId: userId,
        weightKg: weightKg,
        heightCm: heightCm,
        ...rest,
        bmi: bmi,
      },
      update: {
        weightKg: weightKg,
        heightCm: heightCm,
        ...rest,
        bmi: bmi,
      },
    });

    this.recommendationService.generateRecommendation(userId);

    return updatedProfile;
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId: userId },
    });

    if (!profile) {
      throw new NotFoundException('Chưa có hồ sơ, vui lòng cập nhật.');
    }

    // Get user's profile picture URL
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { profilePictureUrl: true },
    });

    return {
      ...profile,
      profilePictureUrl: user?.profilePictureUrl || null,
    };
  }

  async updateProfilePicture(userId: string, fileUrl: string) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { profilePictureUrl: fileUrl },
        select: {
          id: true,
          email: true,
          fullName: true,
          profilePictureUrl: true,
        },
      });

      // Verify the update was successful
      if (!user.profilePictureUrl || user.profilePictureUrl !== fileUrl) {
        throw new Error('Database update failed - profilePictureUrl not set correctly');
      }

      return {
        message: 'Profile picture updated successfully',
        profilePictureUrl: user.profilePictureUrl,
      };
    } catch (error) {
      // Log the error for debugging
      console.error('Error updating profile picture:', error);
      throw error;
    }
  }
}
