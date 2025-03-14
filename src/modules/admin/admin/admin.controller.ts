import { BadRequestException, Controller, Get, Param, UseGuards,} from '@nestjs/common';
import { AdminAuthGuard } from '@app/shared/guards/admin-auth.guard';
import { AdminService } from './admin.service';

@Controller('admin/admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Get('list')
  async list() {
    const data = await this.adminService.list();
    if(data.error){ throw new BadRequestException(data.data)}
    return data;
  }

  @Get('/id/:id')
  async getById(@Param('id') id: string) {
    const data = await this.adminService.byId(id);
    if(data.error){ throw new BadRequestException(data.data)}
    return data;
  }
}