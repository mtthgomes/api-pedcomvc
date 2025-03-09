import { Gender } from '@prisma/client';
import { IsString, IsEmail, IsDate, IsBoolean, IsEnum } from 'class-validator';

export class CreateDoctorDto {
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

  @IsString()
  crm: string;

  @IsEnum(Gender)
  gender: Gender;
}