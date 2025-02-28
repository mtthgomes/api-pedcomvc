import { Module, Global } from '@nestjs/common';
import { DoctorAuthModule } from './auth/auth.module';

@Global()
@Module({
  providers: [],
  imports: [DoctorAuthModule],
  exports: [DoctorAuthModule],
})
export class DoctorGlobalModule {}
