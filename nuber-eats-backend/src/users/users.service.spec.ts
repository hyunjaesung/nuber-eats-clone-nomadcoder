import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UserService', () => {
  let service: UsersService;

  beforeAll(async () => {
    // nest 기본 제공 테스트 모듈 이용
    // 시작 전에 테스트 모듈 생성
    const modules = await Test.createTestingModule({
      providers: [UsersService],
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
