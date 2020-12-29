import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailVerification } from './entities/emailVerification.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';

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

describe('UserService', () => {
  let service: UsersService;

  beforeAll(async () => {
    // nest 기본 제공 테스트 모듈 이용
    // 시작 전에 테스트 모듈 생성
    const modules = await Test.createTestingModule({
      providers: [
        UsersService,
        // 모킹으로 dependency 에러 해결
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.todo('createAccount');
  it.todo('login');
  it.todo('userProfile');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
