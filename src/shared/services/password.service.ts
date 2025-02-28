import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { MyLogger } from './logger.service';

@Injectable()
export class PasswordService {
  constructor(private readonly logger: MyLogger) {}
  private readonly saltRounds = 12;

  async hashPassword(password: string) {
    return bcryptjs.hash(password, this.saltRounds);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcryptjs.compare(password, hashedPassword);
  }
}
