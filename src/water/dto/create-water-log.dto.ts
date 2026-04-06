import { IsInt, Min, IsOptional, IsDateString } from 'class-validator';

export class CreateWaterLogDto {
  @IsInt({ message: 'amountMl phải là số nguyên (ml).' })
  @Min(1, { message: 'Số ml phải lớn hơn 0.' })
  amountMl!: number;

  @IsOptional()
  @IsDateString({}, { message: 'loggedAt phải là một chuỗi ngày hợp lệ.' })
  loggedAt?: string;
}
