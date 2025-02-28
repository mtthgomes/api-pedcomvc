import { Gender } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class GenderDto {
  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(Gender)
  interestedIn: Gender;
}