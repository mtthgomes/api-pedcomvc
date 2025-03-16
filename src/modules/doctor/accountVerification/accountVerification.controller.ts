import { Controller, Post, Body, HttpException, HttpStatus, UseGuards} from '@nestjs/common';
import { DoctorAccountValidationService } from './accountVerification.service';
import { AccountVerificationDto } from './dto/create.dto';
import { GetDoctorId } from '@app/shared/decorator/get-doctor-id.decorator';
import { DoctorAuthGuard } from '@app/shared/guards/doctor-auth.guard';

@Controller('doctor/account_verification')
@UseGuards(DoctorAuthGuard)
export class DoctorAccountValidationController {
  constructor(
    private readonly accountVerificationService: DoctorAccountValidationService,
  ) {}

  @Post('/create')
  async create(@Body() accountVerificationDto: AccountVerificationDto, @GetDoctorId() doctorId: string): Promise<any> {
    const create = await this.accountVerificationService.create(accountVerificationDto, doctorId);
    if(create.error) {
      throw new HttpException(create.data, HttpStatus.BAD_REQUEST);
    }
    return create;
  }

  @Post('/send-again')
  async sendAgain(@GetDoctorId() doctorId: string): Promise<any> {
    const validate = await this.accountVerificationService.sendAgain(doctorId);
    if(validate.error) {
      throw new HttpException(validate.data, HttpStatus.BAD_REQUEST);
    }
    return validate;
  }

  @Post('/validate')
  async validate(@Body() accountVerificationDto: AccountVerificationDto, @GetDoctorId() doctorId: string): Promise<any> {
    const create = await this.accountVerificationService.validate(accountVerificationDto, doctorId);
    if(create.error) {
      throw new HttpException(create.data, HttpStatus.BAD_REQUEST);
    }
    return create;
  }
}