import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async list(): Promise<{ error: boolean; data: string|object }> {
    try{
      return {"error": false, "data": await this.prisma.admin.findMany()}
    } catch {
      return {"error": true, "data": "Erro ao listar admins..."}
    }
   }

   async byId(id: string): Promise<{ error: boolean; data: string|object }> {
    try{
      const admin = await this.prisma.admin.findUnique({where:{id}});
      if(!admin){ return {"error": true, "data": "Admin não encontrado."} }
      return {"error": false, "data": admin}
    } catch {
      return {"error": true, "data": "Erro ao encontrar Admin..."}
    }
   }
  }