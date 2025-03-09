import { Module } from '@nestjs/common';
import { DoctorChannelController } from './chat.controller';
import { DoctorChatService } from './chat.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { tokenDoctorService } from '../auth/doctor.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [DoctorChannelController],
  providers: [DoctorChatService, tokenDoctorService, JwtService],
  exports: [tokenDoctorService, JwtService],
})
export class DoctorChatModule {}