import { PrismaService } from '@app/shared/database/prisma.service';
import { MyLogger } from '@app/shared/services/logger.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { DigitCodeService } from '@app/shared/services/digit-code.service';

@Injectable()
export class GetStreamRefValidator {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: MyLogger,
    private readonly digitCodeService: DigitCodeService, // 🔹 Serviço para gerar o código
  ) {}

  async generateAndValidateToken(): Promise<{ error: boolean; data: string }> {
    let attempts = 0; 
    const maxAttempts = 10; // 🔒 Evita loops infinitos

    while (attempts < maxAttempts) {
      const newGetStreamRef = this.digitCodeService.generateThirteenDigitCode();

      const doctor = await this.prisma.doctor.findUnique({
        where: { getStreamRef: newGetStreamRef },
      });

      if (!doctor) {
        const guardian = await this.prisma.guardian.findUnique({
          where: { getStreamRef: newGetStreamRef },
        });

        if (!guardian) {
          return {"error": false, "data": newGetStreamRef}; // ✅ Referência válida encontrada
        }
      }

      attempts++;

      await this.delay(200 * attempts);
    }

    return {"error": true, "data": "Erro ao gerar Token"};
  }

  // 🔹 Função auxiliar para criar um delay
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}