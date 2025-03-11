import { Controller, HttpException, HttpStatus, Get, UseGuards, Param, Post } from '@nestjs/common';
import { DoctorCepService } from './cep.service';
import { DoctorAuthGuard } from '@app/shared/guards/doctor-auth.guard';
import { GetDoctorId } from '@app/shared/decorator/get-doctor-id.decorator';

@Controller('doctor/cep')
@UseGuards(DoctorAuthGuard)
export class DoctorCepController {
  constructor(
    private readonly chatService: DoctorCepService,
  ) {}

  // @Post("/generate")
  // async generate(): Promise<any> {
  //   const sendAgain = await this.chatService.generate();
  //   if(sendAgain.error) {
  //     throw new HttpException(sendAgain.data, HttpStatus.BAD_REQUEST);
  //   }
  //   return sendAgain;
  // }

  @Get('/list/state')
  async listState(): Promise<any> {
    const sendAgain = await this.chatService.listStates();
    if(sendAgain.error) {
      throw new HttpException(sendAgain.data, HttpStatus.BAD_REQUEST);
    }
    return sendAgain;
  }

  @Get('/list/city/:id')
  async listCity(@Param('id') id: string): Promise<any> {
    const sendAgain = await this.chatService.listCitys(id);
    if(sendAgain.error) {
      throw new HttpException(sendAgain.data, HttpStatus.BAD_REQUEST);
    }
    return sendAgain;
  }
}