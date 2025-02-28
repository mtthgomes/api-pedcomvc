import { Injectable } from "@nestjs/common";
import { CreateUserDto } from '@app/shared/dtos/auth/createUser.dto';
import { PrismaService } from 'src/shared/database/prisma.service';
import { isValidCPF } from "src/shared/validators/cpf.validator";

@Injectable()
export class ValidatorUserUseCase {
  constructor( private prisma: PrismaService){}

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

    return{  "error": false, "data": "Todos os campos estão preenchidos" }
  }

  async existe(userDTO: CreateUserDto): Promise<{ error: boolean; data: string }> {
    const existingAuthenticableCpf = await this.prisma.guardian.findFirst({
      where: {
        cpf: userDTO.cpf
      }
    });

    if (existingAuthenticableCpf) {
      return {
        error: true,
        data: "Esse Cpf já está em uso."
      };
    }

    const existingAuthenticablePhone = await this.prisma.guardian.findFirst({
      where: {
        whatsapp: userDTO.whatsapp
      }
    });

    if (existingAuthenticablePhone) {
      return {
        error: true,
        data: "Esse telefone já está em uso."
      };
    }

    const existingAuthenticableEmail = await this.prisma.guardian.findFirst({
      where: {
        email: userDTO.email
      }
    });

    if (existingAuthenticableEmail) {
      return {
        error: true,
        data: "Esse Email já está em uso."
      };
    }

    return {
      error: false,
      data: "Não existe nenhum usuario com esses dados"
    };
  }
}