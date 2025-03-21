import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { MyLogger } from 'src/shared/services/logger.service';
import { PasswordService } from 'src/shared/services/password.service';
import { tokenDoctorService } from './doctor.guard';
import * as bcryptjs from 'bcryptjs';
import { ValidatorDoctorUseCase } from './use-case/validator-use-case';
import { StatusType } from '@prisma/client';
import { CreateDoctorDto } from '@app/shared/dtos/auth/createDoctor.dto';
import { firebaseTokenDto } from './dto/firebase.dto';
import { descriptionDto } from './dto/profile';
import { MulterFile } from '@app/shared/interfaces/multer';
import { R2UploadService } from '@app/shared/services/r2/cloudflare-r2.service';
import { EmailService } from '@app/shared/services/email.service';
import { GetStreamRefValidator } from '@app/shared/validators/getStreamRef.validator';
import { StreamService } from '@app/shared/services/getStream/streamService';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
    private readonly passwordService: PasswordService,
    private readonly ValidatorUser: ValidatorDoctorUseCase,
    private readonly tokenService: tokenDoctorService,
    private readonly getStreamService: StreamService,
    private readonly imageUploadService: R2UploadService,
    private readonly emailService: EmailService,
    private readonly getStreamRefValidator: GetStreamRefValidator
  ) {}

  async createDoctor(doctorDTO: CreateDoctorDto): Promise<{ error: boolean; data: string }> {
    const result = await this.ValidatorUser.validateAll(doctorDTO);

    if (result.error) {
        return { error: true, data: result.data };
    }

    try {
        const [hashedPassword, newGetStreamRef, existingCrm] = await Promise.all([
            this.passwordService.hashPassword(doctorDTO.passwordHash),
            this.getStreamRefValidator.generateAndValidateToken(),
            this.prisma.doctor.findUnique({ where: { crm: doctorDTO.crm } })
        ]);

        if (newGetStreamRef.error) {
            return { error: true, data: "Erro ao gerar referência Stream." };
        }

        if (existingCrm) {
            return { error: true, data: "CRM já cadastrado." };
        }

        const prefix = doctorDTO.gender === 'MALE' ? 'Dr' : 'Dra';

        // 🔥 Gera o token diretamente com o `StreamService`
        const getStreamToken = await this.getStreamService.generateToken(newGetStreamRef.data);

        // 🔥 Cria usuário no StreamChat e banco de dados em paralelo
        const [_, __] = await Promise.all([
            this.prisma.doctor.create({
                data: {
                    ...doctorDTO,
                    passwordHash: hashedPassword,
                    getStreamRef: newGetStreamRef.data,
                    getStreamToken,
                    prefix
                }
            }),
            this.getStreamService.createUser(
                newGetStreamRef.data,
                doctorDTO.name,
                doctorDTO.email,
                newGetStreamRef.data
            )
        ]);

        // 🔥 Envia o e-mail separadamente, sem impactar o tempo de resposta
        this.emailService.sendMailDoctorWelcome(doctorDTO.email, `${prefix} ${doctorDTO.name}`)
            .catch(err => this.logger.warn(`Erro ao enviar email: ${err.message}`));

        return { error: false, data: "Médico criado com sucesso!" };
    } catch (error) {
        await this.deleteUser(doctorDTO.email);
        this.logger.error('CREATE_USER_ERROR', error);
        return { error: true, data: "Erro ao criar Usuário." };
    }
  }

  private async deleteUser(email: string) {
    const existingUser = await this.prisma.doctor.findUnique({ where: { email } });
  
    if (!existingUser) {
      return;
    }
  
    await this.prisma.doctor.delete({ where: { email } });
  }

  async validateDoctor(email: string, password: string): Promise<{ error: boolean; data: any }> {
    const user = await this.prisma.doctor.findUnique({ where: { email }, include: {accountVerification: true} });
  
    if (!user) {
      return { error: true, data: "As suas credenciais de acesso estão incorretas." };
    }
  
    const tokens = await this.prisma.token.findMany({ where: { doctorId: user.id } });
  
    if (user.status === StatusType.INACTIVE) {
      if (tokens.length > 0) {
        await this.prisma.token.deleteMany({ where: { doctorId: user.id } });
      }
      return { error: true, data: "Acesso bloqueado. Entre em contato com o suporte." };
    }
  
    const passwordMatch = await bcryptjs.compare(password, user.passwordHash);
  
    if (!passwordMatch) {
      return { error: true, data: "As suas credenciais de acesso estão incorretas." };
    }
  
    const token = await this.tokenService.generateUserToken(user.id, "DOCTOR"); 
  
    return { error: false, data: { ...user, access_token: token.data } };
  }

    async updateNotification(id: string, notificationToken: firebaseTokenDto): Promise<{ error: boolean; data: string }>{
      if(!notificationToken.firebaseToken){ return { error: true, data: `FirebaseToken don't send` }; }
      try{
        const doctor = await this.prisma.doctor.findUnique({where: {id}})
        if(doctor.firebaseToken === notificationToken.firebaseToken){
          return { error: false, data: "Notification Token já está atualizado!" };
        }
        await this.getStreamService.updateFirebaseToken(doctor.getStreamRef, notificationToken.firebaseToken);
        await this.prisma.doctor.update({where: {id}, data: {firebaseToken: notificationToken.firebaseToken}})
        return { error: false, data: "Notification Token atualizado com sucesso!" };
      } catch (error) {
        this.logger.error('UPDATE_NOTIFICATION_DOCTOR_ERROR', error);
        return { error: true, data: `Erro updating FirebaseToken` };
      }
    }

    async updateProfile(dependentDto: descriptionDto, doctorId: string, image_user: MulterFile): Promise<{ error: boolean; data: string }> {
        try {
          // Verifica se o guardião existe
          const guardian = await this.prisma.doctor.findUnique({
            where: { id: doctorId },
          });
    
          if (!guardian) {
            return { error: true, data: 'Médico não encontrado no sistema' };
          }
    
          if(!dependentDto.description){
            return { error: true, data: 'Descrição não enviada' };
          }

          const state = await this.prisma.state.findUnique({
            where: { id: dependentDto.stateId },
          });
    
          if (!state) {
            return { error: true, data: 'Estado não encontrado no sistema' };
          }

          const city = await this.prisma.city.findUnique({
            where: { id: dependentDto.cityId },
          });
    
          if (!city) {
            return { error: true, data: 'Cidade não encontrado no sistema' };
          }

          const rqe = await this.prisma.doctor.findUnique({
            where: {rqe: dependentDto.rqe}
          })

          if (rqe) {
            return { error: true, data: 'Rqe já existe no sistema...' };
          }

          const image = await this.imageUploadService.uploadFile(image_user);

          if(image.error === true){
            return { error: true, data: image.data };
          }
    
          const dependent = await this.prisma.doctor.update({
            where: {id: doctorId},
            data: {
              description: dependentDto.description,
              photo: image.data,
              status: 'ACTIVE',
              stateId: dependentDto.stateId,
              cityId: dependentDto.cityId,
              specialty: dependentDto.specialty,
              rqe: dependentDto.rqe
            },
          });
    
          return { error: false, data: dependent.id };
        } catch (error) {
          this.logger.error('UPDATE_PROFILE_DOCTOR_ERROR:', error);
          return { error: true, data: `Erro ao atualizar perfil médico` };
        }
      }
}
