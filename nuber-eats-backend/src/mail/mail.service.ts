import got from 'got';
import * as FormData from 'form-data';
import { Injectable, Inject } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../common/common.constant';
import { MailModuleOptions } from './mail.interface';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions, // 커스텀 provider 주입 // private readonly configService: ConfigService,
  ) {}

  //   curl -s --user 'api:YOUR_API_KEY' \
  //   https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages \
  //   -F from='Excited User <mailgun@YOUR_DOMAIN_NAME>' \
  //   -F to=YOU@YOUR_DOMAIN_NAME \
  //   -F to=bar@example.com \
  //   -F subject='Hello' \
  //   -F text='Testing some Mailgun awesomeness!'
  private async sendEmail(
    subject: string,
    content: string,
    // to:string
  ) {
    const form = new FormData();
    form.append('from', `Excited User <mailgun@${this.options.domain}>`);
    form.append('to', `stevehjsung@gmail.com`); // 원래는 인자로 받아서 넣어야함
    form.append('text', content);
    form.append('subject', subject);

    const response = await got(
      `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      {
        https: {
          rejectUnauthorized: false,
        },
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
          // base64 형태로 포맷해서 보내야한다
        },
        method: 'POST',
        body: form,
      },
    );
  }
}
