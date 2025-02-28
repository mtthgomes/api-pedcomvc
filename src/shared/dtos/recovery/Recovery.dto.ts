import { IsString, IsEmail } from 'class-validator';

export class EmailRecoveryDto {
  @IsEmail()
  email: string;
}

export class ValidateRecoveryDto {
  @IsEmail()
  email: string;

  @IsString()
  token: string;
}

export class RecoveryDataDto {
  @IsEmail()
  email: string;

  @IsString()
  token: string;

  @IsString()
  password: string;
}