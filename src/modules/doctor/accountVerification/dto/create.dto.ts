import { IsString } from 'class-validator';

export class AccountVerificationDto {
  @IsString()
  token?: string;

  @IsString()
  verificationMethod: string;
}