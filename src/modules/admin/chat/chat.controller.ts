import { BadRequestException, Controller, Get, Param, UseGuards,} from '@nestjs/common';
import { AdminAuthGuard } from '@app/shared/guards/admin-auth.guard';
import { ChatService } from './chat.service';

@Controller('admin/chat')
@UseGuards(AdminAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  @Get('list')
  async list() {
    const data = await this.chatService.list();
    if(data.error){ throw new BadRequestException(data.data)}
    return data;
  }

  @Get('/id/:id')
  async getById(@Param('id') id: string) {
    const data = await this.chatService.byId(id);
    if(data.error){ throw new BadRequestException(data.data)}
    return data;
  }
}