import { Module } from '@nestjs/common';
import { DoctorRecoveryController } from './recovery.controller';
import { DoctorRecoveryService } from './recovery.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PasswordService } from '@app/shared/services/password.service';
import { DigitCodeService } from '@app/shared/services/digit-code.service';
import { EmailService } from '@app/shared/services/email.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [DoctorRecoveryController],
  providers: [DoctorRecoveryService, PasswordService, DigitCodeService, EmailService],
})
export class DoctorRecoveryModule {}