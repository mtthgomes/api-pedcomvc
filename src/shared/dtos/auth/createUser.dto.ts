import { Gender } from '@prisma/client';
import { IsString, IsEmail, IsDate, IsEnum, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  cpf: string;

  @IsString()
  whatsapp: string;

  @IsEmail()
  email: string;

  @IsString()
  passwordHash: string;

  @IsDate()
  birthDate: Date;

  @IsBoolean()
  termsAccepted: boolean;

  @IsEnum(Gender)
  gender: Gender;
}