import { PrismaService } from '@app/shared/database/prisma.service';
import { MyLogger } from '@app/shared/services/logger.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DoctorDependentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: MyLogger
  ) {}

  async list(doctorId: string): Promise<{ error: boolean; data: string|object }> {
    try {
      const doctor = await this.prisma.doctor.findUnique({
        where: { id: doctorId },
      });

      if (!doctor) {
        return { error: true, data: 'Médico não encontrado' };
      }

      const dependents = await this.prisma.dependent.findMany({
        where: { doctorId: doctorId },
        include: { doctor: true, chats: true }
      });

      return { error: false, data: dependents };
    } catch (error) {
      this.logger.error('LIST_DEPENDENTS_ERROR_DOCTOR', error);
      return { error: true, data: `Erro ao listar dependentes` };
    }
  }

  /// **🔍 Busca um dependente pelo ID**
  async findById(id: string): Promise<{ error: boolean; data: any }> {
    try {
      const dependent = await this.prisma.dependent.findUnique({
        where: { id },
        include: { doctor: true, guardian: true }
      });

      if (!dependent) {
        return { error: true, data: 'Dependente não encontrado' };
      }

      return { error: false, data: dependent };
    } catch (error) {
      this.logger.error('FIND_CHAT_BY_ID_ERROR_DOCTOR', error);
      return { error: true, data: `Erro ao buscar dependente: ${error.message}` };
    }
  }
}