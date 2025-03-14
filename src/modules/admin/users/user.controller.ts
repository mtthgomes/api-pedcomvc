import { BadRequestException, Controller, Get, Param, UseGuards,} from '@nestjs/common';
import { AdminAuthGuard } from '@app/shared/guards/admin-auth.guard';
import { UserService } from './user.service';

@Controller('admin/user')
@UseGuards(AdminAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('list')
  async list() {
    const data = await this.userService.list();
    if(data.error){ throw new BadRequestException(data.data)}
    return data;
  }

  @Get('list/notificationToken')
  async listNotificationToken() {
    const data = await this.userService.listNotificationToken();
    if(data.error){ throw new BadRequestException(data.data)}
    return data;
  }

  @Get('/id/:id')
  async getById(@Param('id') id: string) {
    const data = await this.userService.byId(id);
    if(data.error){ throw new BadRequestException(data.data)}
    return data;
  }
}