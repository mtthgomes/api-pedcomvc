import { IsString } from 'class-validator';

export class descriptionDto {
  @IsString()
  description: string;
}