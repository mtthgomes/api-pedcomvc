import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class TokenAdminService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async generateAdminToken(adminId: string, userType: 'ADMIN') {
    const { authToken, resetToken, authExpiry, resetExpiry } = this.createTokens(adminId, userType);

    const newToken = await this.prisma.token.create({
      data: { adminId, authToken, resetToken, authExpiry, resetExpiry, userType },
    });

    return { error: false, data: { authToken, resetToken } };
  }

  async refreshTokens(resetToken: string) {
    const tokenRecord = await this.prisma.token.findFirst({ where: { resetToken, userType: "ADMIN" } });

    if (!tokenRecord || tokenRecord.resetExpiry < new Date()) {
      return { error: true, data: "logout" };
    }

    const { authToken, resetToken: newResetToken, authExpiry, resetExpiry } = this.createTokens(tokenRecord.adminId, "ADMIN");

    // Criando um novo token e invalidando o antigo
    await this.prisma.token.updateMany({
      where: { resetToken },
      data: { authToken, resetToken: newResetToken, authExpiry, resetExpiry },
    });

    return { error: false, data: { authToken, resetToken: newResetToken } };
  }

  async decryptToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { error: false, data: decoded };
    } catch (error) {
      return { error: true, data: "logout" };
    }
  }

  async findByToken(authToken: string) {
    const tokenRecord = await this.prisma.token.findFirst({ where: { authToken } });
  
    if (!tokenRecord || tokenRecord.authExpiry < new Date()) {
      return { error: true, data: "logout" };
    }
  
    // 🔹 Verifica se o adminId está presente antes de buscar o usuário
    if (!tokenRecord.adminId) {
      return { error: true, data: "logout" };
    }
  
    const admin = await this.prisma.admin.findUnique({
      where: { id: tokenRecord.adminId },
    });
  
    // 🔹 Caso o usuário não seja encontrado, retorna erro
    if (!admin) {
      return { error: true, data: "logout" };
    }
  
    return { error: false, data: admin.id };
  }  

  async validateToken(authToken: string) {
    const decryptionResult = await this.decryptToken(authToken);
    if (decryptionResult.error) return { error: true, data: "logout" };

    const tokenRecord = await this.prisma.token.findFirst({ where: { authToken } });

    if(tokenRecord.adminId === null){
      return { error: true, data: "logout" };
    }

    if (!tokenRecord) return { error: true, data: "logout" };
    if (!decryptionResult.data.adminId) return { error: true, data: "logout" };

    const admin = await this.prisma.admin.findUnique({ where: { id: decryptionResult.data.adminId } });

    if (tokenRecord.authExpiry < new Date()) {
      const newTokens = await this.refreshTokens(tokenRecord.resetToken);
      if (newTokens.error) return { error: true, data: "logout" };

      admin['access_token'] = newTokens.data;
      return { error: false, data: admin };
    }

    return { error: false, data: admin };
  }

  private createTokens(adminId: string, userType: string) {
    const authToken = this.jwtService.sign({ adminId, userType }, { expiresIn: '30d' });
    const resetToken = this.jwtService.sign({ adminId, userType }, { expiresIn: '60d' });

    const authExpiry = new Date(Date.now() + 30 * 86400000); // 30 days
    const resetExpiry = new Date(Date.now() + 60 * 86400000); // 60 days

    return { authToken, resetToken, authExpiry, resetExpiry };
  }
}