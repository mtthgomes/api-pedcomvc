import { Controller, Post, Body, BadRequestException, HttpException, HttpStatus, Get, UseGuards, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserDependentService } from './dependent.service';
import { EmailRecoveryDto, RecoveryDataDto, ValidateRecoveryDto } from '@app/shared/dtos/recovery/Recovery.dto';
import { DependentDto } from './dto/create.dto';
import { UserAuthGuard } from '@app/shared/guards/user-auth.guard';
import { GetUserId } from '@app/shared/decorator/get-user-id.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from '@app/shared/interfaces/multer';

@Controller('user/dependent')
@UseGuards(UserAuthGuard)
export class UserDependentController {
  constructor(
    private readonly dependentService: UserDependentService,
  ) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() dependentDto: DependentDto, @GetUserId() userId: string, @UploadedFile() image_user: MulterFile): Promise<any> {
    if(image_user === undefined){
      throw new HttpException("Imagem não enviada", HttpStatus.BAD_REQUEST);
    }
    const create = await this.dependentService.create(dependentDto, userId, image_user);
    if(create.error) {
      throw new HttpException(create.data, HttpStatus.BAD_REQUEST);
    }
    return create;
  }

  @Get('/list')
  async sendAgain(@GetUserId() userId: string): Promise<any> {
    const sendAgain = await this.dependentService.list(userId);
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