import { BadRequestException, Controller, Get, Param, UseGuards,} from '@nestjs/common';
import { AdminAuthGuard } from '@app/shared/guards/admin-auth.guard';
import { DependentService } from './dependents.service';

@Controller('admin/dependent')
@UseGuards(AdminAuthGuard)
export class DependentController {
  constructor(
    private readonly dependentService: DependentService,
  ) {}

  @Get('list')
  async list() {
    const data = await this.dependentService.list();
    if(data.error){ throw new BadRequestException(data.data)}
    return data;
  }

  @Get('/id/:id')
  async getById(@Param('id') id: string) {
    const data = await this.dependentService.byId(id);
    if(data.error){ throw new BadRequestException(data.data)}
    return data;
  }
}