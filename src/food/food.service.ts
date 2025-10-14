import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.services";
import { CreateFoodDto } from "./dto/create-food.dto";
import { UpdateFoodDto } from "./dto/update-food.dto";

@Injectable()
export class FoodService {
    constructor(private prisma: PrismaService) {}

    create(data: CreateFoodDto) {
        return this.prisma.food.create({data});
    }

    findAll() {
        return this.prisma.food.findMany();
    }

    findOne(id: string) {
        return this.prisma.food.findUnique({ where:{id} });
    }

    update(id: string, data: UpdateFoodDto) {
        return this.prisma.food.update({ where: {id}, data });
    }

    remove(id: string) {
        return this.prisma.food.delete({ where: {id} });
    }
}