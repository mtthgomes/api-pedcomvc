import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from 'src/shared/database/database.module';
import { MyLogger } from 'src/shared/services/logger.service';
import { PrismaService } from './shared/database/prisma.service';
import { UserGlobalModule } from './modules/user/user.module';
import { DoctorGlobalModule } from './modules/doctor/doctor.module';
import { AdminGlobalModule } from './modules/admin/admin.module';

@Global()
@Module({
  imports: [
    UserGlobalModule,
    DoctorGlobalModule,
    DatabaseModule,
    AdminGlobalModule,
  ],
  controllers: [AppController],
  providers: [
        AppService, MyLogger, PrismaService],
  exports: [AppService, MyLogger, PrismaService],
})
export class AppModule {}