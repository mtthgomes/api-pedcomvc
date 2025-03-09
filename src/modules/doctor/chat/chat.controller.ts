import { Controller, HttpException, HttpStatus, Get, UseGuards, Param } from '@nestjs/common';
import { DoctorChatService } from './chat.service';
import { DoctorAuthGuard } from '@app/shared/guards/doctor-auth.guard';
import { GetDoctorId } from '@app/shared/decorator/get-doctor-id.decorator';

@Controller('doctor/chat')
@UseGuards(DoctorAuthGuard)
export class DoctorChannelController {
  constructor(
    private readonly chatService: DoctorChatService,
  ) {}

  @Get('/list')
  async list(@GetDoctorId() doctorId: string): Promise<any> {
    const sendAgain = await this.chatService.list(doctorId);
    if(sendAgain.error) {
      throw new HttpException(sendAgain.data, HttpStatus.BAD_REQUEST);
    }
    return sendAgain;
  }

  @Get('/id/:id')
  async findById(@Param('id') id: string): Promise<any> {
    const validate = await this.chatService.findById(id);
    if(validate.error) {
      throw new HttpException(validate.data, HttpStatus.BAD_REQUEST);
    }
    return validate;
  }

  @Get('/slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<any> {
    const validate = await this.chatService.findBySlug(slug);
    if(validate.error) {
      throw new HttpException(validate.data, HttpStatus.BAD_REQUEST);
    }
    return validate;
  }
}