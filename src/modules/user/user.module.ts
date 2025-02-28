import { Module, Global } from '@nestjs/common';
import { UserAuthModule } from './auth/auth.module';
import { TokenUserService } from './auth/user.guard';
import { UserRecoveryModule } from './recovery/recovery.module';

@Global()
@Module({
  providers: [],
  imports: [UserAuthModule, UserRecoveryModule],
  exports: [UserAuthModule, UserRecoveryModule],
})
export class UserGlobalModule {}
