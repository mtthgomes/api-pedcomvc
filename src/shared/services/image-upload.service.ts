import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { FormData } from "formdata-node"
import { MulterFile } from '../interfaces/multer';

@Injectable()
export class ImageUploadService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  private getUploadUrl(): string {
    return this.configService.get<string>('IMAGE_UPLOAD_URL');
  }

  private getRemoveUrl(): string {
    return this.configService.get<string>('IMAGE_REMOVE_URL');
  }

  async uploadImage(file: MulterFile): Promise<{ error: boolean, data: string }> {
    const url = this.getUploadUrl();
    const formData = new FormData();
    const fileSend = new File([file.buffer], file.originalname)
    formData.append('file', fileSend);

    try {
      const response = await lastValueFrom(this.httpService.post(url, formData ));

      if (response.status === 201 && response.data.filename) {
        return { error: false, data: response.data.filename };
      } else {
        return { error: true, data: "Falha ao enviar a imagem. Verifique a resposta do servidor." };
      }
    } catch (error) {
      return { error: true, data: "Erro ao fazer upload da imagem. Tente novamente." };
    }
  }
}