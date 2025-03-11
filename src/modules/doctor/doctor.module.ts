import { Module, Global } from '@nestjs/common';
import { DoctorAuthModule } from './auth/auth.module';
import { DoctorDependentModule } from './dependent/dependent.module';
import { tokenDoctorService } from './auth/doctor.guard';
import { DoctorChatModule } from './chat/chat.module';
import { DoctorRecoveryModule } from './recovery/recovery.module';

@Global()
@Module({
  providers: [],
  imports: [DoctorAuthModule, DoctorRecoveryModule, DoctorDependentModule, DoctorChatModule],
  exports: [DoctorAuthModule, DoctorRecoveryModule, DoctorDependentModule, DoctorChatModule],
})
export class DoctorGlobalModule {}
