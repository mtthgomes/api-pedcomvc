import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async list(): Promise<{ error: boolean; data: string|object }> {
    try{
      return {"error": false, "data": await this.prisma.chat.findMany({include: {dependent: {include: {guardian: true}}, doctor: true}})}
    } catch {
      return {"error": true, "data": "Erro ao listar usuarios..."}
    }
   }

   async byId(id: string): Promise<{ error: boolean; data: string|object }> {
    try{
      const doctor = await this.prisma.chat.findUnique({where:{id}, include: {dependent: {include: {guardian: true}}, doctor: true}});
      if(!doctor){ return {"error": true, "data": "Usuario não encontrado."} }
      return {"error": false, "data": doctor}
    } catch {
      return {"error": true, "data": "Erro ao encontrar Usuario..."}
    }
   }
  }