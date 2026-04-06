import { Controller, Post, UploadedFile, UseInterceptors, Get, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { MealPhotoService } from './meal-photo.service';
import { existsSync, mkdirSync } from 'fs';

@Controller('meal-photo')
export class MealPhotoController {
  constructor(private readonly mealPhotoService: MealPhotoService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'meal-photos');
          if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, name + extname(file.originalname));
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.mealPhotoService.handleUploadedFile(file);
  }

  @Get('metadata/:id')
  async getMetadata(@Param('id') id: string) {
    return this.mealPhotoService.getMetadata(id);
  }

  @Get('list')
  async listAll() {
    return this.mealPhotoService.listAllMetadata();
  }
}
