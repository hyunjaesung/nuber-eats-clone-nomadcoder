import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailVerification } from './entities/emailVerification.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';

// 그냥 object 형태면 이 object 쓰는 곳은 값을 다 공유함
// 예를 들어 아래의 userRepository emailVerificationRepository가 완전히 같은
// 메서드를 공유하고 있어서 중복 호출 됨
const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;
// Repository 메서드 이름들 죄다 key로 가지고 옴

describe('UserService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;
  let verificationRepository: MockRepository<EmailVerification>;
  let mailService: MailService;
  beforeAll(async () => {
    // nest 기본 제공 테스트 모듈 이용
    // 시작 전에 테스트 모듈 생성
    const modules = await Test.createTestingModule({
      providers: [
        UsersService,
        // 모킹으로 UsersService dependency 에러 해결
        {
          provide: getRepositoryToken(User), // 엔티티로 레포지토리 만들어줌
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(EmailVerification), // 엔티티로 레포지토리 만들어줌
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    // service를 밖으로 꺼내기
    service = modules.get<UsersService>(UsersService);
    usersRepository = modules.get(getRepositoryToken(User));
    verificationRepository = modules.get(getRepositoryToken(EmailVerification));
    mailService = modules.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount_test', () => {
    const createAccountArg = {
      email: 'test@test.com',
      password: '',
      role: 1,
    };
    it('이미 계정이 존재하는 경우 테스트', async () => {
      // 테스트를 하려면 이미 유저가 있는 것처럼 속여야한다
      // mock 함수의 반환 값을 테스트 용으로 교체해야한다

      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });
      // 이 경우 가짜 User 레포의 findOne 의 return Promise Resolve
      // 값으로 mock 값 넣어준다

      const result = await service.createAccount(createAccountArg);
      // 실행 시켜서 console.log 찍어보면 findOne이 mock 반환중
      expect(result).toMatchObject({
        ok: false,
        error: '계정을 생성할수 없습니다',
      });
    });

    it('유저 생성 테스트', async () => {
      // 메서드 mock 데이터 설정
      usersRepository.findOne.mockResolvedValue(undefined);
      usersRepository.create.mockReturnValue(createAccountArg);
      usersRepository.save.mockResolvedValue(createAccountArg);
      verificationRepository.create.mockReturnValue({ user: createAccountArg });
      verificationRepository.save.mockResolvedValue({ code: 'testcode' });

      // 실행
      const result = await service.createAccount(createAccountArg);
      // 테스트
      // return { ok: true };

      expect(result).toEqual({ ok: true });

      // 테스트
      //   const user = await this.users.save(
      //     this.users.create({ email, password, role }),
      //   );
      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      // 몇번 호출 되는지 확인도 가능
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArg);
      // 무슨 인자로 호출 됐는지
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArg);

      // 테스트
      // const verification = await this.emailVerification.save(
      //     this.emailVerification.create({
      //       user,
      //     }),
      //   );
      expect(verificationRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: createAccountArg,
      });
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith({
        user: createAccountArg,
      });

      // 테스트
      //   this.mailService.sendVerificationEmail(user.email, verification.code);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
    });
  });

  it.todo('login');
  it.todo('userProfile');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
