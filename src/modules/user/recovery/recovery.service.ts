import { PrismaService } from '@app/shared/database/prisma.service';
import { EmailRecoveryDto, RecoveryDataDto, ValidateRecoveryDto } from '@app/shared/dtos/recovery/Recovery.dto';
import { DigitCodeService } from '@app/shared/services/digit-code.service';
import { EmailService } from '@app/shared/services/email.service';
import { MyLogger } from '@app/shared/services/logger.service';
import { PasswordService } from '@app/shared/services/password.service';
import { Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';

@Injectable()
export class UserRecoveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: MyLogger,
    private readonly generateCode: DigitCodeService,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService
  ) {}

  async startRecovery(emailDto: EmailRecoveryDto): Promise<{ error: boolean; data: string }> {
    const user = await this.prisma.guardian.findUnique({
      where: { email: emailDto.email },
    });

    if (!user) {
      return { error: true, data: 'Usuario não encontrado no sistema' };
    }

    try {
      const code = this.generateCode.generateSixDigitCode();

      const recoveryExpiry = new Date();
      recoveryExpiry.setHours(recoveryExpiry.getHours() + 4);

      const tokenData = {
        token: code,
        expiresAt: recoveryExpiry,
        userId: user.id,
        userType: UserType.GUARDIAN,
      };

      await this.prisma.passwordRecovery.upsert({
        where: { guardianId: user.id },
        update: {
          token: code,
          expiresAt: recoveryExpiry,
          userType: 'GUARDIAN',
          guardianId: user.id,
        },
        create: tokenData,
      });

      await this.emailService.sendMailRecoveryPassword(user.email, user.name, code);

      return { error: false, data: 'O pedido de recuperação de senha foi criado com sucesso.' };
    } catch (error) {
      this.logger.error('CREATE_RECOVERY_USER_ERROR', error);
      return { error: true, data: `Failed to create recovery user: ${error.message}` };
    }
  }

  async sendAgain(emailDto: EmailRecoveryDto): Promise<{ error: boolean; data: string }> {
    const user = await this.prisma.guardian.findUnique({
      where: { email: emailDto.email },
    });

    if (!user) {
      return { error: true, data: 'Usuario não encontrado no sistema' };
    }

    const isValid = await this.isValid(emailDto);

    if (!isValid) {
      return { error: true, data: 'Token expirado... tente novamente.' };
    }

    try {
      const recovery = await this.prisma.passwordRecovery.findUnique({
        where: { guardianId: user.id },
      });

      await this.emailService.sendMailRecoveryPassword(user.email, user.name, recovery.token);

      return { error: false, data: 'O email foi enviado novamente...' };
    } catch (error) {
      this.logger.error('SEND_AGAIN_RECOVERY_USER_ERROR', error);
      return { error: true, data: `Failed to resend recovery email: ${error.message}` };
    }
  }

  async validateToken(validateData: ValidateRecoveryDto): Promise<{ error: boolean; data: string }> {
    const user = await this.prisma.guardian.findUnique({
      where: { email: validateData.email },
    });

    if (!user) {
      return { error: true, data: 'Usuario não encontrado no sistema.' };
    }

    try {
      const recovery = await this.prisma.passwordRecovery.findUnique({
        where: { guardianId: user.id },
        include: { guardian: true },
      });

      if (recovery.token !== validateData.token) {
        return { error: true, data: 'Token incorreto... tente novamente.' };
      }

      const isValid = await this.isValid(validateData);

      if (isValid.error !== false) {
        return { error: true, data: 'Token Invalido' };
      }

      return { error: false, data: 'Token Valido' };
    } catch (error) {
      this.logger.error('RECOVERY_USER_VALIDATE', error);
      return { error: true, data: error.message };
    }
  }

  async resetPassword(recoveryData: RecoveryDataDto): Promise<{ error: boolean; data: string }> {
    const user = await this.prisma.guardian.findUnique({
      where: { email: recoveryData.email },
    });

    if (!user) {
      return { error: true, data: 'Usuario não encontrado no sistema.' };
    }

    try {
      const isValid = await this.isValid(recoveryData);

      if (isValid.error !== false) {
        return { error: true, data: 'Token Invalido' };
      }

      await this.prisma.passwordRecovery.update({
        where: { guardianId: user.id },
        data: { status: true },
      });

      await this.prisma.guardian.update({
        where: { id: user.id },
        data: { passwordHash: await this.passwordService.hashPassword(recoveryData.password) },
      });

      await this.removePreviousToken(recoveryData);

      return { error: false, data: 'Senha alterada com sucesso' };
    } catch (error) {
      this.logger.error('RECOVERY_USER_PASSWORD', error);
      return { error: true, data: 'Erro ao alterar a senha do usuário. Tente novamente' };
    }
  }

  async isValid(emailDto: EmailRecoveryDto): Promise<{ error: boolean }> {
    const user = await this.prisma.guardian.findUnique({
      where: { email: emailDto.email },
    });

    try {
      const recovery = await this.prisma.passwordRecovery.findUnique({
        where: { guardianId: user.id },
      });

      if (recovery.status !== false) {
        return { error: true };
      }

      const now = new Date();
      if (recovery.expiresAt < now) {
        return { error: true };
      }

      return { error: false };
    } catch (error) {
      this.logger.error('RECOVERY_USER_ISVALID', error);
      return { error: true };
    }
  }

  async removePreviousToken(emailDto: EmailRecoveryDto): Promise<{ error: boolean }> {
    const user = await this.prisma.guardian.findUnique({
      where: {
        email: emailDto.email
      }
    })

    try {
      const recovery = await this.prisma.passwordRecovery.findUnique({
        where: { guardianId: user.id },
      });

      if (!recovery) {
        return { error: false };
      }

      await this.prisma.passwordRecovery.delete({
        where: { id: recovery.id },
      });

      return { error: false };
    } catch (error) {
      this.logger.error('RECOVERY_USER_DELETE', error);
      return { error: true };
    }
  }
}