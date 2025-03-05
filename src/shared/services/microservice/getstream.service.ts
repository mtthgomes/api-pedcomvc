import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetStreamService {
  private readonly apiUrl: string;
  private readonly authToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('GETSTREAM_API_URL');
    this.authToken = this.configService.get<string>('GETSTREAM_AUTH_TOKEN');
  }

  /// **📌 Criar Usuário**
  async createUser(userData: { id: string; name: string; email: string; referenceId: string }) {
    const url = `${this.apiUrl}/api/users/createUser`;
    const headers = { Authorization: `Bearer ${this.authToken}` };
    const { data } = await this.httpService.post(url, userData, { headers }).toPromise();
    return data;
  }

  /// **📌 Gerar Token do Usuário**
  async getUserToken(userId: string) {
    const url = `${this.apiUrl}/api/auth/token/${userId}`;
    const headers = { Authorization: `Bearer ${this.authToken}` };
    const { data } = await this.httpService.get(url, { headers }).toPromise();
    return data;
  }

  /// **📌 Criar Chat**
  async createChat(payload: { channelId: string; userId: string; members: string[] }) {
    const url = `${this.apiUrl}/api/chat/createChat`;
    const headers = { Authorization: `Bearer ${this.authToken}` };
    const { data } = await this.httpService.post(url, payload, { headers }).toPromise();
    return data;
  }

  /// **📌 Atualizar Firebase Token**
  async updateFirebaseToken(payload: { userId: string; firebaseToken: string }) {
    const url = `${this.apiUrl}/api/users/updateFirebaseToken`;
    const headers = { Authorization: `Bearer ${this.authToken}` };
    const { data } = await this.httpService.post(url, payload, { headers }).toPromise();
    return data;
  }

  /// **📌 Listar Dispositivos de um Usuário**
  async getUserDevices(userId: string) {
    const url = `${this.apiUrl}/devices/${userId}`;
    const headers = { Authorization: `Bearer ${this.authToken}` };
    const { data } = await this.httpService.get(url, { headers }).toPromise();
    return data;
  }
}