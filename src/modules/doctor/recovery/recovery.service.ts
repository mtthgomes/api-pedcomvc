import { PrismaService } from '@app/shared/database/prisma.service';
import { EmailRecoveryDto, RecoveryDataDto, ValidateRecoveryDto } from '@app/shared/dtos/recovery/Recovery.dto';
import { DigitCodeService } from '@app/shared/services/digit-code.service';
import { EmailService } from '@app/shared/services/email.service';
import { MyLogger } from '@app/shared/services/logger.service';
import { PasswordService } from '@app/shared/services/password.service';
import { Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';

@Injectable()
export class DoctorRecoveryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: MyLogger,
    private readonly generateCode: DigitCodeService,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService
  ) {}

  async startRecovery(emailDto: EmailRecoveryDto): Promise<{ error: boolean; data: string }> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { email: emailDto.email },
    });

    if (!doctor) {
      return { error: true, data: 'Médico não encontrado no sistema' };
    }

    try {
      const code = this.generateCode.generateSixDigitCode();

      const recoveryExpiry = new Date();
      recoveryExpiry.setHours(recoveryExpiry.getHours() + 4);

      const tokenData = {
        token: code,
        expiresAt: recoveryExpiry,
        doctorId: doctor.id,
        userType: UserType.DOCTOR,
      };

      await this.prisma.passwordRecovery.upsert({
        where: { doctorId: doctor.id },
        update: {
          token: code,
          expiresAt: recoveryExpiry,
          userType: 'DOCTOR',
          doctorId: doctor.id,
        },
        create: tokenData,
      });

      await this.emailService.sendMailRecoveryPassword(doctor.prefix + '' + doctor.email, doctor.name, code);

      return { error: false, data: 'O pedido de recuperação de senha foi criado com sucesso.' };
    } catch (error) {
      this.logger.error('CREATE_RECOVERY_DOCTOR_ERROR', error);
      return { error: true, data: `Erro ao enviar pedido de recuperação de senha` };
    }
  }

  async sendAgain(emailDto: EmailRecoveryDto): Promise<{ error: boolean; data: string }> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { email: emailDto.email },
    });

    if (!doctor) {
      return { error: true, data: 'Médico não encontrado no sistema' };
    }

    const isValid = await this.isValid(emailDto);

    if (!isValid) {
      return { error: true, data: 'Token expirado... tente novamente.' };
    }

    try {
      const recovery = await this.prisma.passwordRecovery.findUnique({
        where: { doctorId: doctor.id },
      });

      await this.emailService.sendMailRecoveryPassword(doctor.email, doctor.name, recovery.token);

      return { error: false, data: 'O email foi enviado novamente...' };
    } catch (error) {
      this.logger.error('SEND_AGAIN_RECOVERY_DOCTOR_ERROR', error);
      return { error: true, data: `Erro ao enviar novamente o token de recuperação` };
    }
  }

  async validateToken(validateData: ValidateRecoveryDto): Promise<{ error: boolean; data: string }> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { email: validateData.email },
    });

    if (!doctor) {
      return { error: true, data: 'Médico não encontrado no sistema.' };
    }

    try {
      const recovery = await this.prisma.passwordRecovery.findUnique({
        where: { doctorId: doctor.id },
        include: { doctor: true },
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
      this.logger.error('RECOVERY_DOCTOR_VALIDATE', error);
      return { error: true, data: error.message };
    }
  }

  async resetPassword(recoveryData: RecoveryDataDto): Promise<{ error: boolean; data: string }> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { email: recoveryData.email },
    });

    if (!doctor) {
      return { error: true, data: 'Médico não encontrado no sistema.' };
    }

    try {
      const isValid = await this.isValid(recoveryData);

      if (isValid.error !== false) {
        return { error: true, data: 'Token Inválido' };
      }

      await this.prisma.passwordRecovery.update({
        where: { doctorId: doctor.id },
        data: { status: true },
      });

      await this.prisma.doctor.update({
        where: { id: doctor.id },
        data: { passwordHash: await this.passwordService.hashPassword(recoveryData.password) },
      });

      await this.removePreviousToken(recoveryData);

      return { error: false, data: 'Senha alterada com sucesso' };
    } catch (error) {
      this.logger.error('RECOVERY_DOCTOR_PASSWORD', error);
      return { error: true, data: 'Erro ao alterar a senha do médico. Tente novamente' };
    }
  }

  async isValid(emailDto: EmailRecoveryDto): Promise<{ error: boolean }> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { email: emailDto.email },
    });

    try {
      const recovery = await this.prisma.passwordRecovery.findUnique({
        where: { doctorId: doctor.id },
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
      this.logger.error('RECOVERY_DOCTOR_ISVALID', error);
      return { error: true };
    }
  }

  async removePreviousToken(emailDto: EmailRecoveryDto): Promise<{ error: boolean }> {
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        email: emailDto.email
      }
    })

    try {
      const recovery = await this.prisma.passwordRecovery.findUnique({
        where: { doctorId: doctor.id },
      });

      if (!recovery) {
        return { error: false };
      }

      await this.prisma.passwordRecovery.delete({
        where: { id: recovery.id },
      });

      return { error: false };
    } catch (error) {
      this.logger.error('RECOVERY_DOCTOR_DELETE', error);
      return { error: true };
    }
  }
}