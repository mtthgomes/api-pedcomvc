import { Module } from '@nestjs/common';
import { ValidatorLoginUseCase } from 'src/shared/validators/login-use-case';
import { AdminVersionController } from './version.controller';
import { AdminVersionService } from './version.service';

@Module({
  controllers: [AdminVersionController],
  providers: [AdminVersionService, ValidatorLoginUseCase],
})
export class AdminVersionModule {}