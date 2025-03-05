import { Module, Global } from '@nestjs/common';
import { UserAuthModule } from './auth/auth.module';
import { TokenUserService } from './auth/user.guard';
import { UserRecoveryModule } from './recovery/recovery.module';
import { UserDependentModule } from './dependent/dependent.module';
import { UserDoctorModule } from './doctor/doctor.module';
import { UserChatModule } from './chat/chat.module';

@Global()
@Module({
  providers: [],
  imports: [UserAuthModule, UserRecoveryModule, UserDependentModule, UserDoctorModule, UserChatModule],
  exports: [UserAuthModule, UserRecoveryModule, UserDependentModule, UserDoctorModule, UserChatModule],
})
export class UserGlobalModule {}
