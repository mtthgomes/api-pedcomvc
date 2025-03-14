import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class HomeService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async list(): Promise<{ error: boolean; data: string|object }> {
    try{
      const dependents = await this.prisma.dependent.findMany();
      const chats = await this.prisma.chat.findMany();
      const doctor = await this.prisma.doctor.findMany();
      const guardian = await this.prisma.guardian.findMany();

      return {"error": false, "data": {
        'dependents': dependents.length, 'chats': chats.length, 
        'guardian': guardian.length, 'doctor': doctor.length}}
    } catch {
      return {"error": true, "data": "Erro ao listar admins..."}
    }
   }
  }