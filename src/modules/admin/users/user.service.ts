import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async list(): Promise<{ error: boolean; data: string|object }> {
    try{
      const users = await this.prisma.guardian.findMany();
      return {"error": false, "data": users}
    } catch {
      return {"error": true, "data": "Erro ao listar usuarios..."}
    }
   }

   async listNotificationToken(): Promise<{ error: boolean; data: string|object }> {
    try{
      const users = await this.prisma.guardian.findMany({ where: { firebaseToken: { not: null, }, }, }); 
      return {"error": false, "data": users}
    } catch {
      return {"error": true, "data": "Erro ao listar usuarios com notificationToken..."}
    }
   }

   async byId(id: string): Promise<{ error: boolean; data: string|object }> {
    try{
      const user = await this.prisma.guardian.findUnique({where:{id}});
      if(!user){ return {"error": true, "data": "Usuario não encontrado."} }
      return {"error": false, "data": user}
    } catch {
      return {"error": true, "data": "Erro ao encontrar Usuario..."}
    }
   }
  }