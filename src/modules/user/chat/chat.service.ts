import { PrismaService } from '@app/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/create.dto';
import { ChatValidator } from './validator/chat.validator';
import { GetStreamService } from '@app/shared/services/microservice/getstream.service';
const slugify = require('slugify');
import { MyLogger } from '@app/shared/services/logger.service';

@Injectable()
export class UserChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly getStreamService: GetStreamService,
    private readonly logger: MyLogger
  ) {}

  /// ** Cria um novo dependente**
  async create(chatDto: ChatDto): Promise<{ error: boolean; data: string }> {
    try {
      // 🔹 Verifica se o dependente existe
      const dependent = await this.prisma.dependent.findUnique({
        where: { id: chatDto.dependentId },
        include: { guardian: true },
      });
  
      if (!dependent) {
        return { error: true, data: 'Dependente não encontrado no sistema' };
      }

      if(dependent.doctorId !== null){
        return { error: false, data: '' };;
      }
  
      // 🔹 Verifica se o médico existe
      const doctor = await this.prisma.doctor.findUnique({
        where: { id: chatDto.doctorId },
      });
  
      if (!doctor) {
        return { error: true, data: 'Médico não encontrado no sistema' };
      }
  
      // 🔹 Validação do DTO
      const validation = ChatValidator.validate(chatDto);
      if (validation.error) {
        return validation;
      }
  
      let chatSlug = slugify(`Paciente-${dependent.name}`, '_');
      let slugValid = await this.prisma.chat.findUnique({
        where: { getStreamChatId: chatSlug },
      });
  
      // 🔹 Se o slug já existir, adiciona um número até encontrar um nome único
      let count = 1;
      while (slugValid) {
        chatSlug = `${slugify(`Paciente-${dependent.name}`)}_${count}`;
        slugValid = await this.prisma.chat.findUnique({
          where: { getStreamChatId: chatSlug },
        });
        count++;
      }
  
      // 🔹 Criar o chat no Stream
      const chat = await this.getStreamService.createChat({
        channelId: chatSlug,
        userId: dependent.guardian.getStreamRef,
        members: [dependent.guardian.getStreamRef, doctor.getStreamRef],
      });
  
      // 🔹 Atualizar o médico vinculado ao dependente
      await this.prisma.dependent.update({
        where: { id: chatDto.dependentId },
        data: { doctorId: chatDto.doctorId },
      });
  
      // 🔹 Salvar no banco de dados
      await this.prisma.chat.create({
        data: {
          doctorId: chatDto.doctorId,
          dependentId: chatDto.dependentId,
          getStreamChatId: chat.id,
        },
      });
  
      return { error: false, data: 'Chat criado com sucesso!' };
    } catch (error) {
      this.logger.error('CREATE_CHAT_ERROR', error);
      return { error: true, data: `Erro ao criar chat` };
    }
  }  

  async findById(id: string): Promise<{ error: boolean; data: any }> {
    try {
      const dependent = await this.prisma.chat.findUnique({
        where: { id },
      });

      if (!dependent) {
        return { error: true, data: 'Chat não encontrado' };
      }

      return { error: false, data: dependent };
    } catch (error) {
      this.logger.error('FIND_CHAT_BY_ID_ERROR', error);
      return { error: true, data: `Erro ao buscar dependente` };
    }
  }

  async findBySlug(slug: string): Promise<{ error: boolean; data: any }> {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: { getStreamChatId: slug },
        include: {doctor: true, dependent: true}
      });

      if (!chat) {
        return { error: true, data: 'Chat não encontrado' };
      }

      return { error: false, data: chat };
    } catch (error) {
      this.logger.error('FIND_CHAT_BY_SLUG_ERROR', error);
      return { error: true, data: `Erro ao buscar dependente` };
    }
  }
}