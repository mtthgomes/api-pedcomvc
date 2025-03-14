import { Module } from '@nestjs/common';
import { ValidatorLoginUseCase } from 'src/shared/validators/login-use-case';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, ValidatorLoginUseCase],
})
export class AdminAdminModule {}