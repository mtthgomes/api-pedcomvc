import { Injectable, LoggerService } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class MyLogger implements LoggerService {
  constructor(private readonly prisma: PrismaService) {}

  private async saveLogToDatabase(level: string, message: string, context?: string, stack?: string) {
    await this.prisma.logs.create({
      data: {
        level,
        message,
        context,
        stack,
      },
    });
  }

  log(message: string) {
    this.saveLogToDatabase('info', message);
  }

  async error(message: string, trace: any, context?: string) {
    const stack = trace instanceof Error ? trace.stack : JSON.stringify(trace);
    await this.saveLogToDatabase('error', message, context, stack);
  }

  warn(message: string, context?: string) {
    this.saveLogToDatabase('warn', message, context);
  }

  debug(message: string, context?: string) {
    this.saveLogToDatabase('debug', message, context);
  }

  verbose(message: string, context?: string) {
    this.saveLogToDatabase('verbose', message, context);
  }
}
