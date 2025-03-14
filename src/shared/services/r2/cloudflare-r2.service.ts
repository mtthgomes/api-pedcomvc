import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as path from 'path';
import { MulterFile } from '@app/shared/interfaces/multer';
import { MyLogger } from '../logger.service';

@Injectable()
export class R2UploadService {
  private readonly s3: S3Client;
  private readonly bucketName = process.env.CLOUDFLARE_R2_BUCKET;
  private readonly logger: MyLogger;

  constructor() {
    this.s3 = new S3Client({
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      region: 'auto',
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
      }
    });
  }

  async uploadFile(file: MulterFile): Promise<{ error: boolean; data: string }> {
    if (!file || !file.buffer || !file.originalname) {
      throw new Error('Arquivo inválido ou vazio.');
    }

    const fileKey = `uploads/${Date.now()}-${path.basename(file.originalname)}`;

    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype || 'application/octet-stream',
    };

    try {
      await this.s3.send(new PutObjectCommand(params));
      return { error: false, data: `https://pub-5ef92185fd2e474380bb7299c2ee7a00.r2.dev/${fileKey}` };
    } catch (error) {
      if (error.name === 'NoSuchBucket') {
        this.logger.error('❗ O bucket especificado não foi encontrado.', error);
      } else if (error.name === 'AccessDenied') {
        this.logger.error('❗ Acesso negado. Verifique suas credenciais.', error);
      } else {
        this.logger.error(`❗ Erro inesperado: ${error.message}`, error);
      }
      return { error: true, data: "Erro ao fazer upload da imagem" };
    }
  }
}