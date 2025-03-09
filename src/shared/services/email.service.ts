import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { MyLogger } from './logger.service';
import { RecoveryPasswordTemplate } from '../assets/emails/recoveryPasswordTemplate';
import { WelcomeTemplate } from '../assets/emails/WelcomeTemplate';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger: MyLogger;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    });
  }

  private replacePlaceholders(template: string, variables: { [key: string]: string }): string {
    return template.replace(/{{(.*?)}}/g, (_, key) => variables[key.trim()] || '');
  }

  async sendMailWelcome(to: string, name: string) {
    let htmlContent = this.replacePlaceholders(WelcomeTemplate, { name });

    const subject = 'Bem vindo ao PedComVc';

    const mailOptions = {
      from: `"PedComVc" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error('SEND_EMAIL_ERROR', error);
    }
  }

  async sendMailRecoveryPassword(to: string, name: string, token: string) {
    let htmlContent = this.replacePlaceholders(RecoveryPasswordTemplate, { name, token });

    const subject = 'Recuperação de Senha - PedComVc';

    const mailOptions = {
      from: `"PedComVc" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error('SEND_EMAIL_ERROR', error);
    }
  }
}