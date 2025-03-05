import { PrismaService } from '@app/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/create.dto';
import { ChatValidator } from './validator/chat.validator';
import { GetStreamService } from '@app/shared/services/microservice/getstream.service';
import slug from 'slug';

@Injectable()
export class UserChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getStreamService: GetStreamService
  ) {}

  /// **🔥 Cria um novo dependente**
  async create(chatDto: ChatDto): Promise<{ error: boolean; data: string }> {
    try {
      // Verifica se o guardião existe
      const guardian = await this.prisma.dependent.findUnique({
        where: { id: chatDto.dependentId },
        include: {guardian: true}
      });

      if (!guardian) {
        return { error: true, data: 'Dependente não encontrado no sistema' };
      }

      const doctor = await this.prisma.doctor.findUnique({
        where: { id: chatDto.doctorId },
      });

      if (!doctor) {
        return { error: true, data: 'Dependente não encontrado no sistema' };
      }

      const validation = ChatValidator.validate(chatDto);
      if (validation.error) {
        return validation;
      }

      const chatSlug = slug(`Paciente-${guardian.name}`)

      const chat = await this.getStreamService.createChat({channelId: chatSlug, userId: guardian.guardian.getStreamRef, members: [guardian.guardian.getStreamRef, doctor.getStreamRef]})

      await this.prisma.dependent.update(
        {where: {id: chatDto.dependentId}, data: {doctorId: chatDto.doctorId}},
      )

      await this.prisma.chat.create({
        data: {
          doctorId: chatDto.doctorId,
          dependentId: chatDto.dependentId,
          getStreamChatId: chat.id
        },
      });

      return { error: false, data: 'Dependente cadastrado com sucesso!' };
    } catch (error) {
      console.error('CREATE_DEPENDENT_ERROR:', error);
      return { error: true, data: `Erro ao criar dependente: ${error.message}` };
    }
  }
}