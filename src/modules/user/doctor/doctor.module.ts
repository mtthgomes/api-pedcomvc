import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UserDoctorController } from './doctor.controller';
import { UserDoctorService } from './doctor.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [UserDoctorController],
  providers: [UserDoctorService],
})
export class UserDoctorModule {}