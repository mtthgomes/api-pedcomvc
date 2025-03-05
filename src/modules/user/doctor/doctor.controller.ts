import { Controller, HttpException, HttpStatus, Get, UseGuards, Param } from '@nestjs/common';
import { UserDoctorService } from './doctor.service';
import { UserAuthGuard } from '@app/shared/guards/user-auth.guard';
import { GetUserId } from '@app/shared/decorator/get-user-id.decorator';

@Controller('user/doctor')
@UseGuards(UserAuthGuard)
export class UserDoctorController {
  constructor(
    private readonly doctorService: UserDoctorService,
  ) {}

  @Get('/list')
  async sendAgain(@GetUserId() userId: string): Promise<any> {
    const sendAgain = await this.doctorService.list();
    if(sendAgain.error) {
      throw new HttpException(sendAgain.data, HttpStatus.BAD_REQUEST);
    }
    return sendAgain;
  }

  @Get('/id/:id')
  async validate(@Param('id') id: string): Promise<any> {
    const validate = await this.doctorService.findById(id);
    if(validate.error) {
      throw new HttpException(validate.data, HttpStatus.BAD_REQUEST);
    }
    return validate;
  }
}