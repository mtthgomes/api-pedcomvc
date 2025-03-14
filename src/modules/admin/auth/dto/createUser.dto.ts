import { Gender } from '@prisma/client';
import { IsString, IsEmail } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  name: string;

  @IsString()
  cpf: string;

  @IsEmail()
  email: string;

  @IsString()
  passwordHash: string;
}