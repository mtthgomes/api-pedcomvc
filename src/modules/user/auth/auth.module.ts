import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenUserService } from './user.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ValidatorLoginUseCase } from '@app/shared/validators/login-use-case';
import { PasswordService } from '@app/shared/services/password.service';
import { ValidatorUserUseCase } from './use-case/validator-use-case';
import { HttpModule } from '@nestjs/axios';
import { DigitCodeService } from '@app/shared/services/digit-code.service';
import { EmailService } from '@app/shared/services/email.service';
import { GetStreamRefValidator } from '@app/shared/validators/getStreamRef.validator';
import { StreamService } from '@app/shared/services/getStream/streamService';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [TokenUserService, AuthService, ValidatorLoginUseCase, PasswordService, ValidatorUserUseCase, StreamService, DigitCodeService, EmailService, GetStreamRefValidator],
  exports: [TokenUserService, AuthService, ValidatorLoginUseCase, PasswordService, ValidatorUserUseCase, StreamService, DigitCodeService, EmailService],
})
export class UserAuthModule {}