import { PrismaService } from '@app/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserDoctorService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async list(): Promise<{ error: boolean; data: string|object }> {
    try {
      const doctors = await this.prisma.doctor.findMany({
        select: {
          id: true,
          name: true,
          photo: true,
          getStreamRef: true
        },
        where: {status: 'ACTIVE'}
      });
      

      return { error: false, data: doctors };
    } catch (error) {
      console.error('LIST_DOCTORS_ERROR:', error);
      return { error: true, data: `Erro ao listar médico: ${error.message}` };
    }
  }

  async findById(id: string): Promise<{ error: boolean; data: any }> {
    try {
      const doctor = await this.prisma.doctor.findUnique({
        where: { id },
      });

      if (!doctor) {
        return { error: true, data: 'Médico não encontrado' };
      }

      return { error: false, data: doctor };
    } catch (error) {
      console.error('FIND_DOCTOR_BY_ID_ERROR:', error);
      return { error: true, data: `Erro ao buscar médico: ${error.message}` };
    }
  }
}