import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as client from '@sendgrid/mail';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

client.setApiKey(
  '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',
);
@Injectable()
export class MailService {
  constructor(private readonly httpService: HttpService) { }

  @Inject(ConfigService)
  private readonly config: ConfigService;

  async sendEmail(email: string, message: string, id: string): Promise<string> {
    const domain = this.config.get<string>('MAIL_URL');

    try {
      await this.httpService.post(`${domain}/send-email`, {
        email,
        message
      }).toPromise()
      return id;
    } catch (error) {
      console.error(error);
    }
  }
}
