import { IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  dependentId: string;

  @IsString()
  doctorId: string;
}