import { IsString } from 'class-validator';

export class firebaseTokenDto {
  @IsString()
  firebaseToken: string;
}