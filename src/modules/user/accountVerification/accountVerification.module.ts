import { Module } from '@nestjs/common';
import { UserAccountValidationController } from './accountVerification.controller';
import { UserAccountValidationService } from './accountVerification.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from '@app/shared/services/email.service';
import { DigitCodeService } from '@app/shared/services/digit-code.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [UserAccountValidationController],
  providers: [UserAccountValidationService, EmailService, DigitCodeService]
})
export class UserAccountValidationModule {}