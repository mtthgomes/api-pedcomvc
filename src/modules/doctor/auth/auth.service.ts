import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { MyLogger } from 'src/shared/services/logger.service';
import { PasswordService } from 'src/shared/services/password.service';
import { tokenDoctorService } from './doctor.guard';
import * as bcryptjs from 'bcryptjs';
import { ValidatorDoctorUseCase } from './use-case/validator-use-case';
import { StatusType } from '@prisma/client';
import { GetStreamService } from '@app/shared/services/microservice/getstream.service';
import { DigitCodeService } from '@app/shared/services/digit-code.service';
import { CreateDoctorDto } from '@app/shared/dtos/auth/createDoctor.dto';
import { firebaseTokenDto } from './dto/firebase.dto';
import { descriptionDto } from './dto/profile';
import { MulterFile } from '@app/shared/interfaces/multer';
import { ImageUploadService } from '@app/shared/services/image-upload.service';
import { R2UploadService } from '@app/shared/services/r2/cloudflare-r2.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: MyLogger,
    private readonly passwordService: PasswordService,
    private readonly ValidatorUser: ValidatorDoctorUseCase,
    private readonly tokenService: tokenDoctorService,
    private readonly getStreamService: GetStreamService,
    private readonly digitCodeService: DigitCodeService,
    private readonly imageUploadService: R2UploadService
  ) {}

  async createDoctor(doctorDTO: CreateDoctorDto): Promise<{ error: boolean; data: string }> {
    const nullable = await this.ValidatorUser.nullable(doctorDTO);
    if (nullable.error) { return { error: true, data: nullable.data }; }
  
    const validate = await this.ValidatorUser.cpf(doctorDTO.cpf);
    if (validate.error) { return { error: true, data: validate.data }; }
  
    const existe = await this.ValidatorUser.existe(doctorDTO);
    if (existe.error) { return { error: true, data: existe.data }; }
  
    try {
      const hashedPassword = await this.passwordService.hashPassword(doctorDTO.passwordHash);
      const userRef = this.digitCodeService.generateThirteenDigitCode();
  
      await this.getStreamService.createUser({ 
        id: userRef, 
        name: doctorDTO.name, 
        email: doctorDTO.email, 
        referenceId: userRef 
      });
  
      const getStreamTokenResponse = await this.getStreamService.getUserToken(userRef);

      let prefix = ''
      if(doctorDTO.gender == 'MALE'){
        prefix="Dr"
      } else {
        prefix="Dra"
      }

      const crm = await this.prisma.doctor.findUnique({ where: { crm: doctorDTO.crm } });
  
      if (crm) {
        return { error: true, data: "CRM já cadastrado" };
      }
  
      await this.prisma.doctor.create({
        data: {
          ...doctorDTO,
          passwordHash: hashedPassword, 
          getStreamRef: userRef, 
          getStreamToken: getStreamTokenResponse.token,
          prefix
        }
      });
  
      return { error: false, data: "Usuário criado com sucesso!" };
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
    const user = await this.prisma.doctor.findUnique({ where: { email } });
  
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
        await this.getStreamService.updateFirebaseToken({userId: doctor.getStreamRef, firebaseToken: notificationToken.firebaseToken});
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
