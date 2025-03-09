import { Module, Global } from '@nestjs/common';
import { DoctorAuthModule } from './auth/auth.module';
import { DoctorDependentModule } from './dependent/dependent.module';
import { tokenDoctorService } from './auth/doctor.guard';
import { DoctorChatModule } from './chat/chat.module';

@Global()
@Module({
  providers: [],
  imports: [DoctorAuthModule, DoctorDependentModule, DoctorChatModule],
  exports: [DoctorAuthModule, DoctorDependentModule, DoctorChatModule],
})
export class DoctorGlobalModule {}
