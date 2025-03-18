import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { MyLogger } from 'src/shared/services/logger.service';
import { PasswordService } from 'src/shared/services/password.service';
import { CreateUserDto } from '@app/shared/dtos/auth/createUser.dto';
import { TokenUserService } from '../auth/user.guard';
import { ValidatorUserUseCase } from './use-case/validator-use-case';
import { StatusType } from '@prisma/client';
import { GetStreamService } from '@app/shared/services/microservice/getstream.service';
import { EmailService } from '@app/shared/services/email.service';
import { GetStreamRefValidator } from '@app/shared/validators/getStreamRef.validator';
import { firebaseTokenDto } from './dto/firebase.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
    private readonly passwordService: PasswordService,
    private readonly ValidatorUser: ValidatorUserUseCase,
    private readonly tokenService: TokenUserService,
    private readonly getStreamService: GetStreamService,
    private readonly emailService: EmailService,
    private readonly getStreamRefValidator: GetStreamRefValidator
  ) {}

  /**
   * 🔹 Criação de usuário otimizada
   */
  async createUser(userDTO: CreateUserDto): Promise<{ error: boolean; data: string }> {
    const [validator, newGetStreamRef] = await Promise.all([
      this.ValidatorUser.validateAll(userDTO),
      this.getStreamRefValidator.generateAndValidateToken()
    ]);

    if (validator.error) return { error: true, data: validator.data };
    if (newGetStreamRef.error) return { error: true, data: "Erro ao gerar referência do usuário." };

    try {
      const [createdUser, getStreamTokenResponse] = await this.prisma.$transaction(async (prisma) => {
        const createdUser = await prisma.guardian.create({
          data: {
            ...userDTO,
            passwordHash: await this.passwordService.hashPassword(userDTO.passwordHash),
            getStreamRef: newGetStreamRef.data,
          }
        });

        const getStreamTokenResponse = await this.getStreamService.createUser({
          id: newGetStreamRef.data,
          name: userDTO.name,
          email: userDTO.email,
          referenceId: newGetStreamRef.data
        }).then(() => this.getStreamService.getUserToken(newGetStreamRef.data));

        return [createdUser, getStreamTokenResponse];
      });

      await this.prisma.guardian.update({
        where: { email: userDTO.email },
        data: { getStreamToken: getStreamTokenResponse.token }
      });

      this.emailService.sendMailWelcome(createdUser.email, createdUser.name);

      return { error: false, data: "Usuário criado com sucesso!" };
    } catch (error) {
      this.logger.error('CREATE_USER_ERROR', error);

      await this.deleteUser(userDTO.email).catch(err =>
        this.logger.error('DELETE_PARTIAL_USER_ERROR', err)
      );

      return { error: true, data: "Erro ao criar Usuário." };
    }
  }  

  /**
   * 🔹 Deleta o usuário caso ocorra erro
   */
  private async deleteUser(email: string) {
    await this.prisma.guardian.delete({ where: { email } }).catch(() => null);
  }

  /**
   * 🔹 Validação e Login de Usuário
   */
  async validateUser(
    email: string, 
    password: string
  ): Promise<{ error: boolean; data: any }> {
    const user = await this.prisma.guardian.findFirst({
      where: { email },
      include: { tokens: true, accountVerification: true }
    });
  
    if (!user) return { error: true, data: "As suas credenciais de acesso estão incorretas." };
  
    if (user.status !== StatusType.ACTIVE) {
      if (user.tokens.length) {
        await this.prisma.token.deleteMany({ where: { guardianId: user.id } });
      }
      return { error: true, data: "Acesso bloqueado. Entre em contato com o suporte." };
    }
  
    const [passwordMatch, token] = await Promise.all([
      this.passwordService.comparePasswords(password, user.passwordHash),
      this.tokenService.generateUserToken(user.id, "GUARDIAN")
    ]);
  
    if (!passwordMatch) return { error: true, data: "As suas credenciais de acesso estão incorretas." };
  
    return { error: false, data: { ...user, access_token: token.data } };
  }  

  /**
   * 🔹 Atualiza o Token de Notificação do Firebase
   */
  async updateNotification(id: string, notificationToken: firebaseTokenDto): Promise<{ error: boolean; data: string }> {
    if (!notificationToken.firebaseToken) {
      return { error: true, data: "FirebaseToken não foi enviado." };
    }

    try {
      const user = await this.prisma.guardian.findUnique({ where: { id } });

      await Promise.all([
        this.getStreamService.updateFirebaseToken({
          userId: user.getStreamRef,
          firebaseToken: notificationToken.firebaseToken
        }),
        this.prisma.guardian.update({
          where: { id },
          data: { firebaseToken: notificationToken.firebaseToken }
        })
      ]);

      return { error: false, data: "Notification Token atualizado com sucesso!" };
    } catch (error) {
      this.logger.error('UPDATE_NOTIFICATION_USER_ERROR', error);
      return { error: true, data: "Erro ao atualizar FirebaseToken." };
    }
  }
}