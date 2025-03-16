import { PrismaService } from '@app/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { AccountVerificationDto } from './dto/create.dto';
import { MyLogger } from '@app/shared/services/logger.service';
import { DigitCodeService } from '@app/shared/services/digit-code.service';
import { sendVerificationCode } from '@app/shared/services/whatsapp/whatsapp.service';
import { EmailService } from '@app/shared/services/email.service';

@Injectable()
export class UserAccountValidationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: MyLogger,
    private readonly generateCode: DigitCodeService,
    private readonly emailService: EmailService
  ) {}

  /// **🔥 Cria ou Atualiza uma verificação de conta**
  async create(
    accountVerificationDto: AccountVerificationDto,
    guardianId: string
  ): Promise<{ error: boolean; data: string }> {
    try {
      const guardian = await this.prisma.guardian.findUnique({
        where: { id: guardianId },
      });

      if (!guardian) {
        return { error: true, data: 'Usuário não encontrado no sistema.' };
      }

      if(!accountVerificationDto.verificationMethod){
        return { error: true, data: 'O metódo de verificação não pode ser vazio' };
      }

      const token = this.generateCode.generateSixDigitCode();

      const recoveryExpiry = new Date();
      recoveryExpiry.setMinutes(recoveryExpiry.getMinutes() + 30);

      await this.prisma.accountVerification.upsert({
        where: { guardianId },
        create: {
          verificationMethod: accountVerificationDto.verificationMethod,
          guardianId,
          token,
          expiresAt: recoveryExpiry,
          status: false, // Marca como não verificado
        },
        update: {
          token,
          expiresAt: recoveryExpiry,
          status: false, // Sempre reseta o status para não verificado
        },
      });

      if (accountVerificationDto.verificationMethod === 'whatsapp') {
        await sendVerificationCode(guardian.whatsapp, token);
      } else {
        await this.emailService.sendMailAccountVerification(guardian.email, guardian.name, token);
      }

      return { error: false, data: "Verificação de conta iniciada com sucesso!" };
    } catch (error) {
      this.logger.error('CREATE_ACCOUNT_VERIFICATION_ERROR', error);
      return { error: true, data: `Erro ao criar verificação de conta: ${error.message}` };
    }
  }

  /// **🔁 Enviar novamente o token de verificação**
  async sendAgain(guardianId: string): Promise<{ error: boolean; data: any }> {
    try {
      const guardian = await this.prisma.guardian.findUnique({
        where: { id: guardianId },
      });

      if (!guardian) {
        return { error: true, data: 'Usuário não encontrado no sistema.' };
      }

      const accountVerification = await this.prisma.accountVerification.findUnique({
        where: { guardianId },
      });

      if (!accountVerification) {
        return { error: true, data: 'Verificação de conta não iniciada, tente novamente.' };
      }

      if (accountVerification.status === true) {
        return { error: true, data: 'Essa verificação já foi concluída com sucesso.' };
      }

      if (new Date() > accountVerification.expiresAt) {
        return { error: true, data: 'Este token expirou. Solicite um novo código.' };
      }

      if (accountVerification.verificationMethod === 'whatsapp') {
        await sendVerificationCode(guardian.whatsapp, accountVerification.token);
      } else {
        await this.emailService.sendMailAccountVerification(
          guardian.email,
          guardian.name,
          accountVerification.token
        );
      }

      return { error: false, data: "Código enviado novamente!" };
    } catch (error) {
      this.logger.error('SEND_AGAIN_ACCOUNT_VERIFICATION_ERROR', error);
      return { error: true, data: `Erro ao reenviar verificação: ${error.message}` };
    }
  }

  /// **✅ Validação do Token de Verificação**
  async validate(
    dependentDto: AccountVerificationDto,
    guardianId: string
  ): Promise<{ error: boolean; data: string }> {
    try {
      const accountVerification = await this.prisma.accountVerification.findUnique({
        where: { guardianId },
      });

      if (!accountVerification) {
        return { error: true, data: 'Verificação de conta não iniciada, tente novamente.' };
      }

      if (accountVerification.status === true) {
        return { error: true, data: 'Essa verificação já foi concluída.' };
      }

      if (new Date() > accountVerification.expiresAt) {
        return { error: true, data: 'Este token expirou. Solicite um novo código.' };
      }

      if (dependentDto.token !== accountVerification.token) {
        return { error: true, data: 'Token inválido. Tente novamente.' };
      }

      const verifiedAt = new Date();

      await this.prisma.accountVerification.update({
        where: { id: accountVerification.id },
        data: { verifiedAt, status: true },
      });

      return { error: false, data: 'Conta verificada com sucesso!' };
    } catch (error) {
      this.logger.error('VALIDATION_ACCOUNT_USER_ERROR', error);
      return { error: true, data: `Erro ao validar conta: ${error.message}` };
    }
  }

  /// **⚠️ Verifica se o token ainda é válido**
  async isValid(id: string): Promise<{ error: boolean }> {
    try {
      const accountVerification = await this.prisma.accountVerification.findUnique({
        where: { id },
      });

      if (!accountVerification) {
        return { error: true };
      }

      if (accountVerification.status === true) {
        return { error: true }; // Token já usado
      }

      if (new Date() > accountVerification.expiresAt) {
        return { error: true }; // Token expirado
      }

      return { error: false }; // Token válido
    } catch (error) {
      this.logger.error('ACCOUNT_VERIFICATION_GUARDIAN_ISVALID', error);
      return { error: true };
    }
  }
}