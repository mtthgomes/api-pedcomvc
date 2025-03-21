import { IsBoolean, IsString } from 'class-validator';

export class CreateVersionDto {
  @IsString()
  versionCode: string;

  @IsString()
  versionName: string;

  @IsBoolean()
  requiredUpdate: boolean;

  @IsString()
  description?: string;
}