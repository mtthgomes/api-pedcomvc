import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class DependentService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async list(): Promise<{ error: boolean; data: string|object }> {
    try{
      return {"error": false, "data": await this.prisma.dependent.findMany({include: {guardian: true}})}
    } catch {
      return {"error": true, "data": "Erro ao listar dependentes..."}
    }
   }

   async byId(id: string): Promise<{ error: boolean; data: string|object }> {
    try{
      const dependent = await this.prisma.dependent.findUnique({where:{id}, include: {guardian: true}});
      if(!dependent){ return {"error": true, "data": "Dependente não encontrado."} }
      return {"error": false, "data": dependent}
    } catch {
      return {"error": true, "data": "Erro ao encontrar dependente..."}
    }
   }
  }