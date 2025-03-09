import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { tokenDoctorService } from './doctor.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ValidatorLoginUseCase } from '@app/shared/validators/login-use-case';
import { PasswordService } from '@app/shared/services/password.service';
import { ValidatorDoctorUseCase } from './use-case/validator-use-case';
import { HttpModule } from '@nestjs/axios';
import { GetStreamService } from '@app/shared/services/microservice/getstream.service';
import { DigitCodeService } from '@app/shared/services/digit-code.service';
import { ImageUploadService } from '@app/shared/services/image-upload.service';

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
  providers: [tokenDoctorService, AuthService, ValidatorLoginUseCase, PasswordService, ValidatorDoctorUseCase, GetStreamService, DigitCodeService, ImageUploadService],
})
export class DoctorAuthModule {}