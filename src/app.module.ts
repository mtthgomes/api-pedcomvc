import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/shared/database/database.module';
import { MyLogger } from 'src/shared/services/logger.service';
import { LOGSModule } from './modules/logs/logs.module';
import { PrismaService } from './shared/database/prisma.service';
import { UserGlobalModule } from './modules/user/user.module';
import { DoctorGlobalModule } from './modules/doctor/doctor.module';

@Global()
@Module({
  imports: [
    UserGlobalModule,
    DoctorGlobalModule,
    DatabaseModule,
    LOGSModule,
  ],
  controllers: [AppController],
  providers: [
        AppService, MyLogger, PrismaService],
  exports: [AppService, MyLogger, PrismaService],
})
export class AppModule {}