import { Module } from '@nestjs/common';
import { UserDependentController } from './chat.controller';
import { UserChatService } from './chat.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { StreamService } from '@app/shared/services/getStream/streamService';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [UserDependentController],
  providers: [UserChatService, StreamService],
})
export class UserChatModule {}