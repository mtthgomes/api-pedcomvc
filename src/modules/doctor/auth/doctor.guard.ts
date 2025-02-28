import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class tokenDoctorService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async generateUserToken(doctorId: string, userType: 'DOCTOR') {
    const { authToken, resetToken, authExpiry, resetExpiry } = this.createTokens(doctorId, userType);

    // Criando novo token sem sobrescrever os anteriores
    const newToken = await this.prisma.token.create({
      data: { doctorId, authToken, resetToken, authExpiry, resetExpiry, userType },
    });

    return { error: false, data: { authToken, resetToken } };
  }

  async refreshTokens(resetToken: string) {
    const tokenRecord = await this.prisma.token.findFirst({ where: { resetToken, userType: "DOCTOR" } });

    if (!tokenRecord || tokenRecord.resetExpiry < new Date()) {
      return { error: true, data: "logout" };
    }

    const { authToken, resetToken: newResetToken, authExpiry, resetExpiry } = this.createTokens(tokenRecord.doctorId, "DOCTOR");

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
    // ✅ Busca o token no banco de dados
    const tokenRecord = await this.prisma.token.findFirst({ where: { authToken } });
  
    // ✅ Se o token não existir ou estiver expirado, retorna logout
    if (!tokenRecord || tokenRecord.authExpiry < new Date()) {
      return { error: true, data: "logout" };
    }
  
    // ✅ Verifica se `doctorId` é nulo antes de buscar o médico
    if (!tokenRecord.doctorId) {
      return { error: true, data: "logout" };
    }
  
    // ✅ Busca o médico pelo ID
    const user = await this.prisma.doctor.findUnique({ where: { id: tokenRecord.doctorId } });
  
    // ✅ Se o médico não for encontrado, retorna logout
    if (!user) {
      return { error: true, data: "logout" };
    }
  
    // ✅ Retorna sucesso com o ID do usuário
    return { error: false, data: user.id };
  }

  async validateToken(authToken: string) {
    const decryptionResult = await this.decryptToken(authToken);
    if (decryptionResult.error) return { error: true, data: "logout" };

    const tokenRecord = await this.prisma.token.findFirst({ where: { authToken } });

    if (!tokenRecord) return { error: true, data: "logout" };
    if (!decryptionResult.data.userId) return { error: true, data: "logout" };

    const user = await this.prisma.doctor.findUnique({ where: { id: decryptionResult.data.userId } });

    if (tokenRecord.authExpiry < new Date()) {
      const newTokens = await this.refreshTokens(tokenRecord.resetToken);
      if (newTokens.error) return { error: true, data: "logout" };

      user['access_token'] = newTokens.data;
      return { error: false, data: user };
    }

    return { error: false, data: user };
  }

  private createTokens(userId: string, userType: string) {
    const authToken = this.jwtService.sign({ userId, userType }, { expiresIn: '24h' });
    const resetToken = this.jwtService.sign({ userId, userType }, { expiresIn: '7d' });

    const authExpiry = new Date(Date.now() + 24 * 3600000); // 24 hours
    const resetExpiry = new Date(Date.now() + 7 * 86400000); // 7 days

    return { authToken, resetToken, authExpiry, resetExpiry };
  }
}