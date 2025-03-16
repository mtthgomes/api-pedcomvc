import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { MyLogger } from 'src/shared/services/logger.service';
import { PasswordService } from 'src/shared/services/password.service';
import { CreateUserDto } from '@app/shared/dtos/auth/createUser.dto';
import { TokenUserService } from '../auth/user.guard';
import * as bcryptjs from 'bcryptjs';
import { ValidatorUserUseCase } from './use-case/validator-use-case';
import { StatusType } from '@prisma/client';
import { GetStreamService } from '@app/shared/services/microservice/getstream.service';
import { DigitCodeService } from '@app/shared/services/digit-code.service';
import { firebaseTokenDto } from './dto/firebase.dto';
import { EmailService } from '@app/shared/services/email.service';
import { GetStreamRefValidator } from '@app/shared/validators/getStreamRef.validator';

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

  async createUser(userDTO: CreateUserDto): Promise<{ error: boolean; data: string }> {
    const nullable = await this.ValidatorUser.nullable(userDTO);
    if (nullable.error) { return { error: true, data: nullable.data }; }
  
    const validate = await this.ValidatorUser.cpf(userDTO.cpf);
    if (validate.error) { return { error: true, data: validate.data }; }
  
    const existe = await this.ValidatorUser.existe(userDTO);
    if (existe.error) { return { error: true, data: existe.data }; }
  
    try {
      const hashedPassword = await this.passwordService.hashPassword(userDTO.passwordHash);
      const newGetStreamRef = await this.getStreamRefValidator.generateAndValidateToken();

      if (newGetStreamRef.error) {
        return { error: true, data: "Erro ao criar Usuário." };
      }
  
      await this.getStreamService.createUser({ 
        id: newGetStreamRef.data, 
        name: userDTO.name, 
        email: userDTO.email, 
        referenceId: newGetStreamRef.data 
      });
  
      const getStreamTokenResponse = await this.getStreamService.getUserToken(newGetStreamRef.data);
  
      const user = await this.prisma.guardian.create({
        data: { 
          ...userDTO, 
          passwordHash: hashedPassword, 
          getStreamRef: newGetStreamRef.data, 
          getStreamToken: getStreamTokenResponse.token 
        }
      });

      this.emailService.sendMailWelcome(user.email, user.name);
  
      return { error: false, data: "Usuário criado com sucesso!" };
    } catch (error) {
      await this.deleteUser(userDTO.email);
      this.logger.error('CREATE_USER_ERROR', error);
      return { error: true, data: "Erro ao criar Usuário." };
    }
  }  

  private async deleteUser(email: string){
    const user = await this.prisma.guardian.findUnique({ where: { email } });
    if(!user){
      return;
    }
    await this.prisma.guardian.delete({ where: { email } });
    return;
  }

  async validateUser(email: string, password: string): Promise<{ error: boolean; data: any }> {
    const user = await this.prisma.guardian.findUnique({ where: { email }, include: {tokens: true, accountVerification: true} });
  
    if (!user) {
      return { error: true, data: "As suas credenciais de acesso estão incorretas." };
    }
  
    if (user.status !== StatusType.ACTIVE) {
      if (user.tokens.length > 0) {
        await this.prisma.token.deleteMany({ where: { guardianId: user.id } });
      }
      return { error: true, data: "Acesso bloqueado. Entre em contato com o suporte." };
    }
  
    const passwordMatch = await bcryptjs.compare(password, user.passwordHash);
  
    if (!passwordMatch) {
      return { error: true, data: "As suas credenciais de acesso estão incorretas." };
    }
  
    const token = await this.tokenService.generateUserToken(user.id, "GUARDIAN");
  
    return { error: false, data: { ...user, access_token: token.data } };
  }

  async updateNotification(id: string, notificationToken: firebaseTokenDto): Promise<{ error: boolean; data: string }>{
    if(!notificationToken.firebaseToken){ return { error: true, data: `FirebaseToken don't send` }; }
    try{
      const user = await this.prisma.guardian.findUnique({where: {id}})
      await this.getStreamService.updateFirebaseToken({userId: user.getStreamRef, firebaseToken: notificationToken.firebaseToken});
      await this.prisma.guardian.update({where: {id}, data: {firebaseToken: notificationToken.firebaseToken}})
      return { error: false, data: "Notification Token atualizado com sucesso!" };
    } catch (error) {
      this.logger.error('UPDATE_NOTIFICATION_USER_ERROR', error);
      return { error: true, data: `Erro updating FirebaseToken` };
    }
  }
}
