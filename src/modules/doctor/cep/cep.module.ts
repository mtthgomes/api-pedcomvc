import { Module } from '@nestjs/common';
import { DoctorCepController } from './cep.controller';
import { DoctorCepService } from './cep.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { tokenDoctorService } from '../auth/doctor.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [DoctorCepController],
  providers: [DoctorCepService, tokenDoctorService, JwtService],
  exports: [tokenDoctorService, JwtService],
})
export class DoctorCepModule {}