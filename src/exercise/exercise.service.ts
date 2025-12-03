import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.services';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExerciseService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.exercise.findMany();
  }

  async findOne(id: string) {
    return this.prisma.exercise.findUnique({ where: { id } });
  }

  async create(data: CreateExerciseDto) {
    return this.prisma.exercise.create({ data });
  }

  async update(id: string, data: UpdateExerciseDto) {
    return this.prisma.exercise.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.exercise.delete({ where: { id } });
  }
}
