import { Controller, HttpException, HttpStatus, Get, UseGuards, Param } from '@nestjs/common';
import { DoctorDependentService } from './dependent.service';
import { GetUserId } from '@app/shared/decorator/get-user-id.decorator';
import { DoctorAuthGuard } from '@app/shared/guards/doctor-auth.guard';
import { GetDoctorId } from '@app/shared/decorator/get-doctor-id.decorator';

@Controller('doctor/dependent')
@UseGuards(DoctorAuthGuard)
export class DoctorDependentController {
  constructor(
    private readonly dependentService: DoctorDependentService,
  ) {}

  @Get('/list')
  async sendAgain(@GetDoctorId() doctorId: string): Promise<any> {
    const sendAgain = await this.dependentService.list(doctorId);
    if(sendAgain.error) {
      throw new HttpException(sendAgain.data, HttpStatus.BAD_REQUEST);
    }
    return sendAgain;
  }

  @Get('/id/:id')
  async validate(@Param('id') id: string): Promise<any> {
    const validate = await this.dependentService.findById(id);
    if(validate.error) {
      throw new HttpException(validate.data, HttpStatus.BAD_REQUEST);
    }
    return validate;
  }
}