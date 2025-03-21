import { Injectable } from "@nestjs/common";
import { CreateUserDto } from '@app/shared/dtos/auth/createUser.dto';
import { PrismaService } from 'src/shared/database/prisma.service';
import { isValidCPF } from "src/shared/validators/cpf.validator";

@Injectable()
export class ValidatorDoctorUseCase {
  constructor(private prisma: PrismaService) {}

  // 🔹 Função principal que valida todas as regras
  async validateAll(doctorDTO: CreateUserDto): Promise<{ error: boolean; data: string }> {
    // 🔹 Validação de campos obrigatórios
    const requiredFields = ['whatsapp', 'cpf', 'name', 'email', 'passwordHash'];
    const missingFields = requiredFields.filter((field) => !doctorDTO[field]);
    if (missingFields.length) {
        return { error: true, data: `Os campos ${missingFields.join(', ')} não podem ser vazios` };
    }

    // 🔹 Validação de CPF
    if (!isValidCPF(doctorDTO.cpf)) {
        return { error: true, data: 'CPF inválido' };
    }

    // 🔹 Validação de Gênero
    if (!['MALE', 'FEMALE', 'OTHER'].includes(doctorDTO.gender)) {
        return { error: true, data: 'Gênero não existe' };
    }

    // 🔹 Validação de existência no banco de dados (retorna no primeiro erro encontrado)
    const [existingCpf, existingPhone, existingEmail] = await Promise.all([
        this.prisma.doctor.findFirst({ where: { cpf: doctorDTO.cpf } }),
        this.prisma.doctor.findFirst({ where: { whatsapp: doctorDTO.whatsapp } }),
        this.prisma.doctor.findFirst({ where: { email: doctorDTO.email } }),
    ]);

    if (existingCpf) {
        return { error: true, data: "Esse CPF já está em uso." };
    }
    if (existingPhone) {
        return { error: true, data: "Esse telefone já está em uso." };
    }
    if (existingEmail) {
        return { error: true, data: "Esse Email já está em uso." };
    }

    // 🔹 Retorno final
    return { error: false, data: "Validação concluída com sucesso" };
  }
}