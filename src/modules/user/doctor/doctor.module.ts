import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ImageUploadService } from '@app/shared/services/image-upload.service';
import { UserDoctorController } from './doctor.controller';
import { UserDoctorService } from './doctor.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [UserDoctorController],
  providers: [UserDoctorService, ImageUploadService],
})
export class UserDoctorModule {}