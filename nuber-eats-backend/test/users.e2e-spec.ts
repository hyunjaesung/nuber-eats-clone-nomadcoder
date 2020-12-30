import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';

// 여기서는 resolver 를 테스트 해보자
describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // beforeAll로 해야함 주의
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  // 테스트 종료 후
  // jest 종료 시켜줘야 한다
  // db drop 시켜야한다
  afterAll(async () => {
    getConnection().dropDatabase();
    app.close();
  });

  it.todo('createAccount');
  it.todo('login');
  it.todo('me');
  it.todo('userProfile');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
