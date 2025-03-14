import { Module } from '@nestjs/common';
import { ValidatorLoginUseCase } from 'src/shared/validators/login-use-case';
import { DependentController } from './dependents.controller';
import { DependentService } from './dependents.service';

@Module({
  controllers: [DependentController],
  providers: [DependentService, ValidatorLoginUseCase],
})
export class AdminDependentModule {}