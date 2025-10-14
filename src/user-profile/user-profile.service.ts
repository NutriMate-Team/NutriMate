import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.services';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUserProfileDto) {
    return this.prisma.userProfile.create({ data });
  }

  findAll() {
    return this.prisma.userProfile.findMany({ include: { user: true } });
  }

  findOne(id: string) {
    return this.prisma.userProfile.findUnique({ where: { id }, include: { user: true } });
  }

  update(id: string, data: UpdateUserProfileDto) {
    return this.prisma.userProfile.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.userProfile.delete({ where: { id } });
  }
}
