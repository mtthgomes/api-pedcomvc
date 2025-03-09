import { IsString, IsOptional, IsDate, IsEnum } from 'class-validator';
import { Gender, StatusType } from '@prisma/client';

export class DependentDto {
  @IsString()
  name: string;

  @IsDate()
  birthDate: Date;

  @IsOptional()
  @IsString()
  comorbidity?: string;

  @IsOptional()
  @IsString()
  medication?: string;

  @IsOptional()
  @IsString()
  allergy?: string;

  @IsOptional()
  @IsString()
  otherInfo?: string;

  @IsEnum(Gender)
  gender: Gender;
}