import { BadRequestException, Controller, Get, UseGuards,} from '@nestjs/common';
import { HomeService } from './home.service';
import { AdminAuthGuard } from '@app/shared/guards/admin-auth.guard';

@Controller('admin/home')
@UseGuards(AdminAuthGuard)
export class HomeController {
  constructor(
    private readonly homeService: HomeService,
  ) {}

  @Get('info')
  async list() {
    const data = await this.homeService.list();
    if(data.error){ throw new BadRequestException(data.data)}
    return data;
  }
}