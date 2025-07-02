import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { TEmailConfig } from 'src/config';

@Injectable()
export class EmailService {
  private readonly emailConfig: TEmailConfig;

  constructor(private readonly configService: ConfigService) {
    this.emailConfig = this.configService.get<TEmailConfig>('email')!;
  }

  async sendEmail(subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.emailConfig.userMail,
        pass: this.emailConfig.password,
      },
    });

    await transporter.sendMail({
      from: `"Todo App" <${this.emailConfig.userMail}>`,
      to: this.emailConfig.targetMail || this.emailConfig.userMail,
      subject,
      text,
    });
  }
}
