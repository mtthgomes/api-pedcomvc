import { Injectable } from "@nestjs/common";
import { CreateUserDto } from '@app/shared/dtos/auth/createUser.dto';
import { PrismaService } from 'src/shared/database/prisma.service';
import { isValidCPF } from "src/shared/validators/cpf.validator";

@Injectable()
export class ValidatorUserUseCase {
  constructor( private prisma: PrismaService){}

  async validateAll(userDTO: CreateUserDto): Promise<{ error: boolean; data: string }> {
    // Executa todas as validações em paralelo
    const [nullable, cpf, existe] = await Promise.all([
      this.nullable(userDTO),
      this.cpf(userDTO.cpf),
      this.existe(userDTO)
    ]);

    // Retorna o primeiro erro encontrado
    if (nullable.error) return nullable;
    if (cpf.error) return cpf;
    if (existe.error) return existe;

    // Todas as validações passaram
    return { error: false, data: "Todos os dados são válidos" };
  }

  async cpf(cpf: string): Promise<{ error: boolean; data: string }> {
    if (!isValidCPF(cpf)) {
      return { error: true, data: 'CPF inválido' };
    }

    return { error: false, data: 'Todos os documentos são válidos' };
  }

  async nullable(userDto: CreateUserDto): Promise<{ error: boolean; data: string }> {
    if(!userDto.whatsapp || !userDto.cpf || !userDto.name || !userDto.email || !userDto.passwordHash){
      return{  "error": true, "data": "O campo Nome, Email, CPF, Telefone e Senha não podem ser vazios" }
    }

    if(userDto.gender != 'MALE' && userDto.gender != 'FEMALE' && userDto.gender != 'OTHER'){
      return { error: true, data: 'Gênero não existe' };
    }

    return{  "error": false, "data": "Todos os campos estão preenchidos" }
  }

  async existe(userDTO: CreateUserDto): Promise<{ error: boolean; data: string }> {
    const existingUser = await this.prisma.guardian.findFirst({
        where: {
            OR: [
                { cpf: userDTO.cpf },
                { whatsapp: userDTO.whatsapp },
                { email: userDTO.email }
            ]
        }
    });

    if (existingUser) {
        if (existingUser.cpf === userDTO.cpf) {
            return { error: true, data: "Esse CPF já está em uso." };
        }
        if (existingUser.whatsapp === userDTO.whatsapp) {
            return { error: true, data: "Esse telefone já está em uso." };
        }
        if (existingUser.email === userDTO.email) {
            return { error: true, data: "Esse Email já está em uso." };
        }
    }

    return { error: false, data: "Não existe nenhum usuário com esses dados." };
  }
}