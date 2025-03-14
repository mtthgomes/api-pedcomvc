import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class DoctorService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async list(): Promise<{ error: boolean; data: string|object }> {
    try{
      const doctors = await this.prisma.doctor.findMany();
      return {"error": false, "data": doctors}
    } catch {
      return {"error": true, "data": "Erro ao listar usuarios..."}
    }
   }

   async listNotificationToken(): Promise<{ error: boolean; data: string|object }> {
    try{
      const doctors = await this.prisma.doctor.findMany({ where: { firebaseToken: { not: null, }, }, }); 
      return {"error": false, "data": doctors}
    } catch {
      return {"error": true, "data": "Erro ao listar usuarios com notificationToken..."}
    }
   }

   async byId(id: string): Promise<{ error: boolean; data: string|object }> {
    try{
      const doctor = await this.prisma.doctor.findUnique({where:{id}});
      if(!doctor){ return {"error": true, "data": "Usuario não encontrado."} }
      return {"error": false, "data": doctor}
    } catch {
      return {"error": true, "data": "Erro ao encontrar Usuario..."}
    }
   }
  }