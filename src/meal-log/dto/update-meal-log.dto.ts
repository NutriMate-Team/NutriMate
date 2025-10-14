import { PartialType } from '@nestjs/mapped-types';
import { CreateMealLogDto } from './create-meal-log.dto';

// Tất cả các trường của CreateMealLogDto đều là tùy chọn (optional)
export class UpdateMealLogDto extends PartialType(CreateMealLogDto) {}