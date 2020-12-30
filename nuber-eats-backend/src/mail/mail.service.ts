import got from 'got';
import * as FormData from 'form-data';
import { Injectable, Inject } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../common/common.constant';
import { MailModuleOptions, EmailVar } from './mail.interface';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions, // 커스텀 provider 주입 // private readonly configService: ConfigService,
  ) {
    // this.sendEmail('Testmail');
  }

  //   curl -s --user 'api:YOUR_API_KEY' \
  //   https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages \
  //   -F from='Excited User <mailgun@YOUR_DOMAIN_NAME>' \
  //   -F to=YOU@YOUR_DOMAIN_NAME \
  //   -F to=bar@example.com \
  //   -F subject='Hello' \
  //   텍스트 이용시
  //   -F text='Testing some Mailgun awesomeness!'
  //   템플릿 이용시
  //   -F template='veryfy-user' \
  //   -F v:변수이름='변수값'
  async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVar[],
    to: string,
  ): Promise<boolean> {
    const form = new FormData();
    form.append(
      'from',
      `Steve from SteveCompany <mailgun@${this.options.domain}>`,
    );
    form.append('to', to);
    form.append('subject', subject);
    // form.append('text', content);
    form.append('template', template);
    emailVars.forEach(({ key, value }) => form.append(key, value));
    // form.append('v:userName', `steve`);
    // form.append('v:code', `stevecode`);
    // form.append('v:company', `stevecompany`);
    try {
      await got.post(
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
          body: form,
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail(
      'Plz Verify Your Email',
      'veryfy-user',
      [
        { key: 'v:userName', value: email },
        { key: 'v:code', value: code },
        { key: 'v:company', value: 'stevecompany' },
      ],
      email,
    );
  }
}
