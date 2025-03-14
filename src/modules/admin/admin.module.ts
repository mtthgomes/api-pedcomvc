import { Module, Global } from '@nestjs/common';
import { AdminAuthModule } from './auth/auth.module';
import { TokenAdminService } from './auth/admin.guard';
import { AdminUserModule } from './users/user.module';
import { AdminAdminModule } from './admin/admin.module';
import { AdminHomeModule } from './home/home.module';
import { AdminDoctorModule } from './doctor/doctor.module';
import { AdminChatModule } from './chat/chat.module';
import { AdminDependentModule } from './dependents/dependents.module';

@Global()
@Module({
  providers: [],
  imports: [
    AdminAuthModule,
    AdminHomeModule,
    AdminAdminModule,
    AdminUserModule,
    AdminDoctorModule,
    AdminChatModule,
    AdminDependentModule
  ],
  exports: [
    AdminAuthModule,
    AdminHomeModule,
    AdminAdminModule,
    AdminUserModule,
    AdminDoctorModule,
    AdminChatModule,
    AdminDependentModule
  ]
})
export class AdminGlobalModule {}