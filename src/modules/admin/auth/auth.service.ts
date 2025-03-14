import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { TokenAdminService } from './admin.guard';
import { ValidatorAdminUseCase } from './use-case/validator-use-case';
import { PasswordService } from 'src/shared/services/password.service';
import { MyLogger } from 'src/shared/services/logger.service';
import { StatusType } from '@prisma/client';
import { CreateAdminDto } from './dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenAdminService: TokenAdminService,
    private readonly ValidatorUser: ValidatorAdminUseCase,
    private readonly passwordService: PasswordService,
    private readonly logger: MyLogger
  ) {}

  async create(adminDto: CreateAdminDto): Promise<{ error: boolean; data: string }> {
    const nullable = await this.ValidatorUser.nullable(adminDto);
    if(nullable.error){ return { error: true, data: nullable.data }; }

    const validate = await this.ValidatorUser.cpf(adminDto.cpf)
    if(validate.error){ return { error: true, data: validate.data }; }

    const existe = await this.ValidatorUser.existe(adminDto);
    if(existe.error){ return { error: true, data: existe.data }; }

    try {
      const hashedPassword = await this.passwordService.hashPassword(adminDto.passwordHash);
      await this.prisma.admin.create({ data: { ...adminDto, passwordHash: hashedPassword },});

      return { error: false, data: "Admin criado com sucesso!" };
    } catch (error) {
      this.logger.error('CREATE_ADMIN_ERROR', error);
      return { error: true, data: `Erro ao criar Admin.` };
    }
  }

  async validateUser(email: string, password: string): Promise<{ error: boolean; data: any }> {
    const admin = await this.prisma.admin.findUnique({ where: { email }, include: {tokens: true} });

    if(!admin){ return { "error": true, "data": "As suas credenciais de acesso estão incorretas." } }

    if (admin.status !== StatusType.ACTIVE) {
      if (admin.tokens.length > 0) {
        await this.prisma.token.deleteMany({ where: { guardianId: admin.id } });
      }
      return { error: true, data: "Acesso bloqueado. Entre em contato com o suporte." };
    }

    if (admin && await this.passwordService.comparePasswords(password, admin.passwordHash)) {
      const token = await this.tokenAdminService.generateAdminToken(admin.id, "ADMIN");
      admin['access_token'] = token.data; return { "error": false, "data": admin }
    }
    return { "error": true, "data": "As suas credenciais de acesso estão incorretas." }
   }

   async list(): Promise<{ error: boolean; data: object | string }>  {
    try{
      const admin = await this.prisma.admin.findMany();
      return { "error": false, "data": admin }
    } catch {
      return { "error": true, "data": "Erro ao list admin" }
    }
   }
  }