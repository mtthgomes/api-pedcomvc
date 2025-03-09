import { PrismaService } from '@app/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { DependentDto } from './dto/create.dto';
import { MulterFile } from '@app/shared/interfaces/multer';
import { ImageUploadService } from '@app/shared/services/image-upload.service';
import { DependentValidator } from './validator/dependent.validator';
import { MyLogger } from '@app/shared/services/logger.service';

@Injectable()
export class UserDependentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageUploadService: ImageUploadService,
    private readonly logger: MyLogger
  ) {}

  /// **🔥 Cria um novo dependente**
  async create(dependentDto: DependentDto, userId: string, image_user: MulterFile): Promise<{ error: boolean; data: string }> {
    try {
      // Verifica se o guardião existe
      const guardian = await this.prisma.guardian.findUnique({
        where: { id: userId },
      });

      if (!guardian) {
        return { error: true, data: 'Guardião não encontrado no sistema' };
      }

      const validation = DependentValidator.validate(dependentDto);
      if (validation.error) {
        return validation;
      }

      const imageUrl = await this.imageUploadService.uploadImage(image_user);
      if (imageUrl.error) {
        return { error: true, data: imageUrl.data };
      }

      const dependent = await this.prisma.dependent.create({
        data: {
          name: dependentDto.name,
          photo: imageUrl.data,
          birthDate: new Date(dependentDto.birthDate),
          comorbidity: dependentDto.comorbidity,
          medication: dependentDto.medication,
          allergy: dependentDto.allergy,
          otherInfo: dependentDto.otherInfo,
          guardianId: userId,
          gender: dependentDto.gender
        },
      });

      return { error: false, data: dependent.id };
    } catch (error) {
      this.logger.error('CREATE_DEPENDENT_ERROR', error);
      return { error: true, data: `Erro ao criar dependente: ${error.message}` };
    }
  }

  /// **📌 Lista todos os dependentes de um guardião**
  async list(guardianId: string): Promise<{ error: boolean; data: string|object }> {
    try {
      const dependents = await this.prisma.dependent.findMany({
        where: { guardianId },
        orderBy: {createdAt: "desc"},
        include: { doctor: true, chats: true }
      });

      return { error: false, data: dependents };
    } catch (error) {
      this.logger.error('LIST_DEPENDENTS_ERROR', error);
      return { error: true, data: `Erro ao listar dependentes: ${error.message}` };
    }
  }

  /// **🔍 Busca um dependente pelo ID**
  async findById(id: string): Promise<{ error: boolean; data: any }> {
    try {
      const dependent = await this.prisma.dependent.findUnique({
        where: { id },
        include: { doctor: true }
      });

      if (!dependent) {
        return { error: true, data: 'Dependente não encontrado' };
      }

      return { error: false, data: dependent };
    } catch (error) {
      this.logger.error('FIND_CHAT_BY_ID_ERROR', error);
      return { error: true, data: `Erro ao buscar dependente: ${error.message}` };
    }
  }
}