import { Injectable } from '@nestjs/common';
import { PrismaService } from './shared/database/prisma.service';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService
  ) {}
  
  getHello(): string {
    return 'Unauthorized';
  }

  async getVersion() {
    return {"version": await this.prisma.version.findFirst({orderBy: {versionCode: 'desc'}})};
  }
}