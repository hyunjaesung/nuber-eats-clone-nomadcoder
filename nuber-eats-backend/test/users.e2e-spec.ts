import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';

// e2e 테스트 에서도 npm 모듈 mocking 해줘야한다
// 테스트 중에는 실제 got 부르고 싶지 않다
jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

const GRAPHQL_ENDPOINT = '/graphql';
const testUser = {
  email: 'test@test,com',
  password: '123',
};

// 여기서는 resolver 를 테스트 해보자
describe('UserModule (e2e)', () => {
  let app: INestApplication;
  const graphqlRequest = ({ query }) =>
    request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({ query });

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
    await getConnection().dropDatabase(); // await 주의
    app.close();
  });

  describe('createAccount', () => {
    it('계정 생성 테스트', () => {
      return request(app.getHttpServer()) // supertest 이용
        .post(GRAPHQL_ENDPOINT)
        .send({
          // http에서 grapqhql 보내는 방식으로 넣어서 query 로 요청
          query: `mutation{
                createAccount(input:{
                  email:"${testUser.email}",
                  password:"${testUser.password}",
                  role:Delivery
                }){
                  ok,
                  error
                }
              }`,
          // `` 쓰면 행 변환 쓸수있음
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });
    // 위에서 이미 생성했으므로 아래서는 실패해야됨
    it('계정 생성 실패하는 경우 테스트', () => {
      return request(app.getHttpServer()) // supertest 이용
        .post(GRAPHQL_ENDPOINT)
        .send({
          // http에서 grapqhql 보내는 방식으로 넣어서 query 로 요청
          query: `mutation{
                createAccount(input:{
                  email:"${testUser.email}",
                  password:"${testUser.password}",
                  role:Delivery
                }){
                  ok,
                  error
                }
              }`,
          // `` 쓰면 행 변환 쓸수있음
        })
        .expect(200)
        .expect((res) => {
          // toBe는 완똑 해야되고 toEqual은 expect.any(String) 가능
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toEqual(
            '계정을 생성할수 없습니다',
          );
        });
    });
  });
  describe('login', () => {
    it('로그인 테스트', () => {
      return graphqlRequest({
        query: `mutation{
            login(input:{email:"${testUser.email}",password:"${testUser.password}"}){
              ok
              error
              token
            }
          }`,
      })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(true);
          expect(login.error).toEqual(null);
          expect(login.token).toEqual(expect.any(String));
        });
    });
    it('로그인 실패 테스트', () => {
      return graphqlRequest({
        query: `
        mutation {
          login(input:{
            email:"${testUser.email}",
            password:"xxx",
          }) {
            ok
            error
            token
          }
        }
      `,
      })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(false);
          expect(login.error).toBe('틀린 비밀번호');
          expect(login.token).toBe(null);
        });
    });
  });
  it.todo('userProfile');
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('editProfile');
});
