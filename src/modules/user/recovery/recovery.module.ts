import { Module } from '@nestjs/common';
import { UserRecoveryController } from './recovery.controller';
import { GuardianRecoveryService } from './recovery.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PasswordService } from '@app/shared/services/password.service';
import { DigitCodeService } from '@app/shared/services/digit-code.service';
import { EmailService } from '@app/shared/services/email.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [UserRecoveryController],
  providers: [GuardianRecoveryService, PasswordService, DigitCodeService, EmailService],
})
export class UserRecoveryModule {}