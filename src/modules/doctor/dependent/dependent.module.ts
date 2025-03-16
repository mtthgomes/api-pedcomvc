import { Module } from '@nestjs/common';
import { DoctorDependentController } from './dependent.controller';
import { DoctorDependentService } from './dependent.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { tokenDoctorService } from '../auth/doctor.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [DoctorDependentController],
  providers: [DoctorDependentService, tokenDoctorService, JwtService],
  exports: [tokenDoctorService, JwtService],
})
export class DoctorDependentModule {}