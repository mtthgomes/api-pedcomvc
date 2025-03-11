import { PediatricSpecialty } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class descriptionDto {
  @IsString()
  description: string;

  @IsString()
  stateId: string;

  @IsString()
  cityId: string;

  @IsString()
  rqe: string;

  @IsEnum(PediatricSpecialty)
  specialty: PediatricSpecialty;
}