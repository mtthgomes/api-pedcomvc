import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { CreateVersionDto } from './dto/createVersion.dto';
import * as semver from 'semver';

@Injectable()
export class AdminVersionService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createDto: CreateVersionDto): Promise<{ error: boolean; data: string | object }> {
    try {
        const { versionCode, requiredUpdate, versionName } = createDto;

        // ✅ Validação de campos obrigatórios
        if (!versionCode || requiredUpdate === undefined || !versionName) {
            return { error: true, data: "Todos os campos são obrigatórios." };
        }

        // ✅ Validação do formato SemVer (1.0.0 / 1.1 / 2.0.5)
        if (!semver.valid(versionCode)) {
            return { error: true, data: "Formato de versão inválido. Use um formato como '1.0.0' ou '1.1'." };
        }

        const existingVersion = await this.prisma.version.findUnique({
            where: { versionCode }
        });

        if (existingVersion) {
            return { error: true, data: `Versão ${existingVersion.versionCode} já existe.` };
        }

        // ✅ Criação da versão se estiver tudo validado
        await this.prisma.version.create({ data: createDto });

        return { error: false, data: "Versão criada com sucesso!" };
    } catch (error) {
        console.error("Erro ao criar versão:", error);
        return { error: true, data: "Erro ao criar versão. Tente novamente." };
    }
  }

  async list(): Promise<{ error: boolean; data: string|object }> {
    try{
      return {"error": false, "data": await this.prisma.version.findMany()}
    } catch {
      return {"error": true, "data": "Erro ao listar versões..."}
    }
   }

   async byId(id: string): Promise<{ error: boolean; data: string|object }> {
    try{
      const version = await this.prisma.version.findUnique({where:{id}});

      if(!version){ return {"error": true, "data": "Versão não encontrada"} }

      return {"error": false, "data": version}
    } catch {
      return {"error": true, "data": "Erro ao encontrar versão..."}
    }
   }
  }