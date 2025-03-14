import { IsString, IsEmail } from 'class-validator';

export class EmailRecoveryDto {
  @IsEmail()
  email: string;

  @IsString()
  typeSend: string
}

export class ValidateRecoveryDto {
  @IsEmail()
  email: string;

  @IsString()
  token: string;

  @IsString()
  typeSend: string
}

export class RecoveryDataDto {
  @IsEmail()
  email: string;

  @IsString()
  token: string;

  @IsString()
  password: string;

  @IsString()
  typeSend: string
}