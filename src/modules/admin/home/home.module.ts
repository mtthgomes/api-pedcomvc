import { Module } from '@nestjs/common';
import { ValidatorLoginUseCase } from 'src/shared/validators/login-use-case';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  controllers: [HomeController],
  providers: [HomeService, ValidatorLoginUseCase],
})
export class AdminHomeModule {}