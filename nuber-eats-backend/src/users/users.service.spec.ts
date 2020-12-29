import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailVerification } from './entities/emailVerification.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerification: jest.fn(),
};

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;
// Repository 메서드 이름들 죄다 key로 가지고 옴

describe('UserService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;

  beforeAll(async () => {
    // nest 기본 제공 테스트 모듈 이용
    // 시작 전에 테스트 모듈 생성
    const modules = await Test.createTestingModule({
      providers: [
        UsersService,
        // 모킹으로 UsersService dependency 에러 해결
        {
          provide: getRepositoryToken(User), // 엔티티로 레포지토리 만들어줌
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(EmailVerification), // 엔티티로 레포지토리 만들어줌
          useValue: mockRepository,
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount_test', () => {
    it('should fail if user exists', async () => {
      // 테스트를 하려면 이미 유저가 있는 것처럼 속여야한다
      // mock 함수의 반환 값을 테스트 용으로 교체해야한다

      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });
      // 이 경우 가짜 User 레포의 findOne 의 return Promise Resolve
      // 값으로 mock 값 넣어준다

      const result = await service.createAccount({
        email: '',
        password: '',
        role: 1,
      });
      // 실행 시켜서 console.log 찍어보면 findOne이 mock 반환중
      expect(result).toMatchObject({
        ok: false,
        error: '계정을 생성할수 없습니다',
      });
    });
  });

  it.todo('login');
  it.todo('userProfile');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
