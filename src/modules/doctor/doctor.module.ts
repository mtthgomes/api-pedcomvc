import { Module, Global } from '@nestjs/common';
import { DoctorAuthModule } from './auth/auth.module';
import { DoctorDependentModule } from './dependent/dependent.module';
import { tokenDoctorService } from './auth/doctor.guard';
import { DoctorChatModule } from './chat/chat.module';
import { DoctorRecoveryModule } from './recovery/recovery.module';
import { DoctorCepModule } from './cep/cep.module';
import { DoctorAccountValidationModule } from './accountVerification/accountVerification.module';

@Global()
@Module({
  providers: [],
  imports: [DoctorAuthModule, DoctorRecoveryModule, DoctorAccountValidationModule, DoctorDependentModule, DoctorChatModule, DoctorCepModule],
  exports: [DoctorAuthModule, DoctorRecoveryModule, DoctorAccountValidationModule, DoctorDependentModule, DoctorChatModule, DoctorCepModule],
})
export class DoctorGlobalModule {}
