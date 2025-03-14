import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/shared/database/prisma.service';
import { isValidCPF } from "src/shared/validators/cpf.validator";
import { CreateAdminDto } from "../dto/createUser.dto";

@Injectable()
export class ValidatorAdminUseCase {
  constructor( private prisma: PrismaService){}

  async cpf(cpf: string): Promise<{ error: boolean; data: string }> {
    if (!isValidCPF(cpf)) {
      return { error: true, data: 'CPF inválido' };
    }

    return { error: false, data: 'Todos os documentos são válidos' };
  }

  async nullable(userDto: CreateAdminDto): Promise<{ error: boolean; data: string }> {
    if(userDto.cpf === '' || userDto.name === '' || userDto.email === '' || userDto.passwordHash === ''){
      return{  "error": true, "data": "O campo Nome, Email, CPF, Telefone e Senha não podem ser vazios" }
    }

    return{  "error": false, "data": "Todos os campos estão preenchidos" }
  }

  async existe(userDTO: CreateAdminDto): Promise<{ error: boolean; data: string }> {
    const existingAuthenticableCpf = await this.prisma.admin.findFirst({
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

    const existingAuthenticableEmail = await this.prisma.admin.findFirst({
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