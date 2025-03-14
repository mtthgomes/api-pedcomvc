import { BadRequestException, Controller, Get, Param, UseGuards,} from '@nestjs/common';
import { AdminAuthGuard } from '@app/shared/guards/admin-auth.guard';
import { DoctorService } from './doctor.service';

@Controller('admin/doctor')
@UseGuards(AdminAuthGuard)
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
  ) {}

  @Get('list')
  async list() {
    const data = await this.doctorService.list();
    if(data.error){ throw new BadRequestException(data.data)}
    return data;
  }

  @Get('list/notificationToken')
  async listNotificationToken() {
    const data = await this.doctorService.listNotificationToken();
    if(data.error){ throw new BadRequestException(data.data)}
    return data;
  }

  @Get('/id/:id')
  async getById(@Param('id') id: string) {
    const data = await this.doctorService.byId(id);
    if(data.error){ throw new BadRequestException(data.data)}
    return data;
  }
}