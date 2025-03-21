import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { StreamChat } from 'stream-chat';

@Injectable()
export class StreamService {
  private client: StreamChat;
  private readonly logger = new Logger(StreamService.name);

  constructor() {
    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new InternalServerErrorException('Stream API keys não configuradas.');
    }

    this.client = new StreamChat(apiKey, apiSecret);
  }

  /**
   * Gera um token de autenticação para o usuário
   */
  async generateToken(userId: string): Promise<string> {
    try {
      return this.client.createToken(userId);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao gerar token');
    }
  }

  /**
   * Cria ou atualiza um usuário
   */
  async createUser(id: string, name: string, email: string, referenceId: string): Promise<void> {
    try {
      await this.client.upsertUser({ id, name, email, referenceId });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }
  }

  /**
   * Atualiza o token do Firebase no usuário
   */
  async updateFirebaseToken(userId: string, firebaseToken: string): Promise<void> {
    try {
      await this.client.updateUser({ id: userId, firebaseToken });
      await this.client.addDevice(firebaseToken, 'firebase', userId, "TestePed");
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar token Firebase.');
    }
  }

  /**
   * Remove um token Firebase do usuário
   */
  async removeFirebaseToken(userId: string, tokenId: string): Promise<void> {
    try {
      await this.client.removeDevice(tokenId, userId);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao remover token Firebase.');
    }
  }

  async createChat(
    channelId: string,
    userId: string,
    members: string[] = [userId]  // 🔹 Agora `members` é opcional e padrão ao próprio `userId`
  ): Promise<{ id: string }> {
    try {
      const channel = this.client.channel('messaging', channelId, {
        members,
        created_by_id: userId,
      });

      await channel.create(); // 🔥 Melhor prática — Garante que o canal é realmente criado
      return { id: channelId };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar canal de chat.');
    }
  }
}