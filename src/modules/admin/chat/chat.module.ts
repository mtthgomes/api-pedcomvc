import { Module } from '@nestjs/common';
import { ValidatorLoginUseCase } from 'src/shared/validators/login-use-case';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ValidatorLoginUseCase],
})
export class AdminChatModule {}