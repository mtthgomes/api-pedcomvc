import { Controller, Post, Body, HttpException, HttpStatus, Get, UseGuards, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserChatService } from './chat.service';
import { UserAuthGuard } from '@app/shared/guards/user-auth.guard';
import { GetUserId } from '@app/shared/decorator/get-user-id.decorator';
import { ChatDto } from './dto/create.dto';

@Controller('user/chat')
@UseGuards(UserAuthGuard)
export class UserDependentController {
  constructor(
    private readonly chatService: UserChatService,
  ) {}

  @Post('/create')
  async create(@Body() dependentDto: ChatDto, @GetUserId() userId: string): Promise<any> {
    const create = await this.chatService.create(dependentDto);
    if(create.error) {
      throw new HttpException(create.data, HttpStatus.BAD_REQUEST);
    }
    return create;
  }

  @Get('/id/:id')
  async validate(@Param('id') id: string): Promise<any> {
    const validate = await this.chatService.findById(id);
    if(validate.error) {
      throw new HttpException(validate.data, HttpStatus.BAD_REQUEST);
    }
    return validate;
  }
}