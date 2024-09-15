import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
@Injectable()
export class MailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // SMTP сервер, який ви використовуєте
      port: 587, // Порт, який використовується сервером
      secure: false, // true для 465, false для інших портів
      auth: {
        user: 'thorykb@gmail.com', // Ваш email
        pass: 'milt pbzg lzhk foxt', // Ваш пароль або app-specific пароль
      },
      tls: {
        rejectUnauthorized: false, // This allows self-signed certificates
      },
    });
  }

  async sendActivationMail(to: string, link: string) {
    const mailOptions = {
      from: '<thorykb@gmail.com>', // Відправник
      to, // Одержувач
      subject: 'Activation letter', // Тема листа
      text: 'click the link',
      html: `
      <div>
          <a href = ${link}>${link}</a>
      </div>
      `
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
