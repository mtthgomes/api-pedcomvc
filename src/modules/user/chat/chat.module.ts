import { Module } from '@nestjs/common';
import { UserDependentController } from './chat.controller';
import { UserChatService } from './chat.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ImageUploadService } from '@app/shared/services/image-upload.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [UserDependentController],
  providers: [UserChatService, ImageUploadService],
})
export class UserChatModule {}