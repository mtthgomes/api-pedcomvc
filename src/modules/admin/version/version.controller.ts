import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards,} from '@nestjs/common';
import { AdminAuthGuard } from '@app/shared/guards/admin-auth.guard';
import { AdminVersionService } from './version.service';
import { CreateVersionDto } from './dto/createVersion.dto';

@Controller('admin/version')
@UseGuards(AdminAuthGuard)
export class AdminVersionController {
  constructor(
    private readonly adminService: AdminVersionService,
  ) {}

  @Post('create')
  async create(@Body() versionDto: CreateVersionDto) {
    const data = await this.adminService.create(versionDto);
    if(data.error){ throw new BadRequestException(data.data)}
    return data;
  }

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