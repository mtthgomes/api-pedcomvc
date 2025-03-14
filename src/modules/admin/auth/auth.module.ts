import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ValidatorLoginUseCase } from 'src/shared/validators/login-use-case';
import { PasswordService } from 'src/shared/services/password.service';
import { ValidatorAdminUseCase } from './use-case/validator-use-case';
import { TokenAdminService } from './admin.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
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
  providers: [AuthService, ValidatorLoginUseCase, ValidatorAdminUseCase, PasswordService, TokenAdminService],
  exports: [TokenAdminService]
})

export class AdminAuthModule {}