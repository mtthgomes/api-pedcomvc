import { IsArray, IsNumber, IsOptional, IsString, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CrmItemDto {
  @IsString()
  id: string;

  @IsString()
  uid: string;

  @IsString()
  tipo: string;

  @IsString()
  nome: string;

  @IsString()
  numero: string;

  @IsOptional()
  @IsString()
  profissao?: string;

  @IsString()
  uf: string;

  @IsString()
  situacao: string;

  @IsString()
  link: string;
}

export class CrmResponseDto {
  @IsString()
  url: string;

  @IsNumber()
  total: number;

  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsString()
  mensagem?: string;

  @IsNumber()
  api_limite: number;

  @IsNumber()
  api_consultas: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrmItemDto)
  item: CrmItemDto[];
}