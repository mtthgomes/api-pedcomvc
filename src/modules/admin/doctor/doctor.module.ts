import { Module } from '@nestjs/common';
import { ValidatorLoginUseCase } from 'src/shared/validators/login-use-case';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';

@Module({
  controllers: [DoctorController],
  providers: [DoctorService, ValidatorLoginUseCase],
})
export class AdminDoctorModule {}