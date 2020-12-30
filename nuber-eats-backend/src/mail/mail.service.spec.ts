import { Test } from '@nestjs/testing';
import got from 'got';
import * as FormData from 'form-data';
import { CONFIG_OPTIONS } from 'src/common/common.constant';
import { MailService } from './mail.service';

jest.mock('got');
jest.mock('form-data');

const TEST_DOMAIN = 'test-domain';
const sendVerificationEmailArgs = {
  email: 'email@test.com',
  code: 'testcode',
};

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'test-apiKey',
            domain: TEST_DOMAIN,
            fromEmail: 'test-fromEmail',
          },
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('should call sendEmail', () => {
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => true);
      // 테스트를 위해서 sendEmail을 mock으로 만들어도 되지만
      // 이 경우 sendEmail을 테스트 할수가 없음
      // mock을 못만드는 경우는 spyOn을 쓰면 된다
      // sendEmail을 중간에 가로채서 콜백 함수로 바꾼다

      service.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );
      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith(
        'Plz Verify Your Email',
        'veryfy-user',
        [
          { key: 'v:userName', value: sendVerificationEmailArgs.email },
          { key: 'v:code', value: sendVerificationEmailArgs.code },
          { key: 'v:company', value: 'stevecompany' },
        ],
        sendVerificationEmailArgs.email,
      );
    });
  });
  describe('sendEmail', () => {
    it('sends email', async () => {
      const ok = await service.sendEmail(
        'Plz Verify Your Email',
        'veryfy-user',
        [
          { key: 'v:userName', value: sendVerificationEmailArgs.email },
          { key: 'v:code', value: sendVerificationEmailArgs.code },
          { key: 'v:company', value: 'stevecompany' },
        ],
        'email',
      );
      const formSpy = jest.spyOn(FormData.prototype, 'append');
      // append는 new로 인스턴스 만든 후만 이용가능
      // prototype을 spyOn 하자
      //   const form = new FormData();
      //     form.append(
      //     'from',
      //     `Steve from SteveCompany <mailgun@${this.options.domain}>`,
      //     );
      expect(formSpy).toHaveBeenCalled();
      expect(got.post).toHaveBeenCalledTimes(1);
      expect(got.post).toHaveBeenCalledWith(
        `https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`,
        expect.any(Object),
      );
      expect(ok).toEqual(true);
    });
    it('fails on error', async () => {
      jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error();
      });
      const ok = await service.sendEmail(
        'Plz Verify Your Email',
        'veryfy-user',
        [
          { key: 'v:userName', value: sendVerificationEmailArgs.email },
          { key: 'v:code', value: sendVerificationEmailArgs.code },
          { key: 'v:company', value: 'stevecompany' },
        ],
        'email',
      );
      expect(ok).toEqual(false);
    });
  });
});
