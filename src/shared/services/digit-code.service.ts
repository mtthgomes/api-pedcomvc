import { Injectable } from '@nestjs/common';

@Injectable()
export class DigitCodeService {
  generateSixDigitCode(): string {
    return this.generateDigitCode(6);
  }

  generateSevenDigitCode(): string {
    return this.generateDigitCode(7);
  }

  generateNineDigitCode(): string {
    return this.generateDigitCode(9);
  }

  generateThirteenDigitCode(): string {
    return this.generateDigitCode(13, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  }

  generateEighteenDigitCode(): string {
    return this.generateDigitCode(18, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  }

  private generateDigitCode(
    length: number,
    characters: string = '0123456789',
  ): string {
    let code = '';
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }
}
