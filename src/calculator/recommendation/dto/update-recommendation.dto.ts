import { PartialType } from '@nestjs/mapped-types';
import { CreateRecommendationDto } from './create-recommendation.dto';

// Tất cả các trường của CreateRecommendationDto đều là tùy chọn (optional)
export class UpdateRecommendationDto extends PartialType(CreateRecommendationDto) {}