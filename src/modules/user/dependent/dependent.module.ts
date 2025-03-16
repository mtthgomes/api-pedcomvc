import { Module } from '@nestjs/common';
import { UserDependentController } from './dependent.controller';
import { UserDependentService } from './dependent.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { R2UploadService } from '@app/shared/services/r2/cloudflare-r2.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [UserDependentController],
  providers: [UserDependentService, R2UploadService]
})
export class UserDependentModule {}