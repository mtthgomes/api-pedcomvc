import { Module } from '@nestjs/common';
import { DoctorAccountValidationController } from './accountVerification.controller';
import { DoctorAccountValidationService } from './accountVerification.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from '@app/shared/services/email.service';
import { DigitCodeService } from '@app/shared/services/digit-code.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [DoctorAccountValidationController],
  providers: [DoctorAccountValidationService, EmailService, DigitCodeService]
})
export class DoctorAccountValidationModule {}