import { Controller, Post, Body, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { DoctorRecoveryService } from './recovery.service';
import { EmailRecoveryDto, RecoveryDataDto, ValidateRecoveryDto } from '@app/shared/dtos/recovery/Recovery.dto';

@Controller('doctor/recovery')
export class DoctorRecoveryController {
  constructor(
    private readonly recoveryService: DoctorRecoveryService,
  ) {}

  @Post('/')
  async create(@Body() emailDto: EmailRecoveryDto): Promise<any> {
    if(emailDto.email === '') {
      throw new BadRequestException('O campo Email não pode estar vazio.');
    }
    const create = await this.recoveryService.startRecovery(emailDto);
    if(create.error) {
      throw new HttpException(create.data, HttpStatus.BAD_REQUEST);
    }
    return create;
  }

  @Post('/send-again')
  async sendAgain(@Body() emailDto: EmailRecoveryDto): Promise<any> {
    if(emailDto.email === '') {
      throw new BadRequestException('O campo Email não pode estar vazio.');
    }
    const sendAgain = await this.recoveryService.sendAgain(emailDto);
    if(sendAgain.error) {
      throw new HttpException(sendAgain.data, HttpStatus.BAD_REQUEST);
    }
    return sendAgain;
  }

  @Post('/validate-token')
  async validate(@Body() validateData: ValidateRecoveryDto): Promise<any> {
    if(validateData.email === '' || validateData.token === '') {
      throw new BadRequestException('O campo Email e token não pode estar vazio.');
    }
    const validate = await this.recoveryService.validateToken(validateData);
    if(validate.error) {
      throw new HttpException(validate.data, HttpStatus.BAD_REQUEST);
    }
    return validate;
  }

  @Post('/reset-password')
  async resetPassword(@Body() recoveryData: RecoveryDataDto): Promise<any> {
    if(recoveryData.email === '' || recoveryData.token === '' || recoveryData.password === '') {
      throw new BadRequestException('O campo Email, token e senha não pode estar vazio.');
    }
    const reset = await this.recoveryService.resetPassword(recoveryData);
    if(reset.error) {
      throw new HttpException(reset.data, HttpStatus.BAD_REQUEST);
    }
    return reset;
  }
}