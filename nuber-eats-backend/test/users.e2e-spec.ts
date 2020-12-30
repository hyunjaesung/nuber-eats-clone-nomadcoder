import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailVerification } from 'src/users/entities/emailVerification.entity';

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
  let jwtToken: string;
  let usersRepository: Repository<User>;
  let verificationsRepository: Repository<EmailVerification>;
  const graphqlRequest = ({ query }) =>
    request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({ query });

  beforeAll(async () => {
    // beforeAll로 해야함 주의
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    verificationsRepository = module.get<Repository<EmailVerification>>(
      getRepositoryToken(EmailVerification),
    );
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
          jwtToken = login.token;
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

  describe('userProfile', () => {
    let userId: number;
    beforeAll(async () => {
      // 위에서 정의해놔서 여기서 쓸수 있음
      const [user] = await usersRepository.find(); // 첫번째 유저 반환
      userId = user.id;
    });
    it("should see a user's profile", () => {
      return (
        request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .set('X-JWT', jwtToken)
          .send({
            query: `
        {
          userProfile(userId:${userId}){
            ok
            error
            user {
              id
            }
          }
        }
        `,
          })
          // 위 처럼 안하고 어짜피 하나니까 userId 1로 하고 해도된다
          .expect(200)
          .expect((res) => {
            const {
              body: {
                data: {
                  userProfile: {
                    ok,
                    error,
                    user: { id },
                  },
                },
              },
            } = res;
            expect(ok).toBe(true);
            expect(error).toBe(null);
            expect(id).toBe(userId);
          })
      );
    });
    it('should not find a profile', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
        {
          userProfile(userId:666){
            ok
            error
            user {
              id
            }
          }
        }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                userProfile: { ok, error, user },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toBe('찾을 수 없습니다');
          expect(user).toBe(null);
        });
    });
  });

  describe('me', () => {
    it('should find my profile', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
          {
            me {
              email
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toBe(testUser.email);
        });
    });
    it('should not allow logged out user', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        {
          me {
            email
          }
        }
      `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: { errors },
          } = res;
          const [error] = errors;
          expect(error.message).toBe('Forbidden resource');
        });
    });
  });
  describe('editProfile', () => {
    const NEW_EMAIL = 'nico@new.com';
    it('should change email', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
            mutation {
              editProfile(input:{
                email: "${NEW_EMAIL}"
              }) {
                ok
                error
              }
            }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                editProfile: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should have new email', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
          {
            me {
              email
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toBe(NEW_EMAIL);
        });
    });
  });
  describe('verifyEmail', () => {
    let verificationCode: string;
    beforeAll(async () => {
      const [verification] = await verificationsRepository.find();
      verificationCode = verification.code;
    });
    it('should verify email', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            verifyEmail(input:{
              code:"${verificationCode}"
            }){
              ok
              error
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                verifyEmail: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
    it('should fail on verification code not found', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            verifyEmail(input:{
              code:"xxxxx"
            }){
              ok
              error
            }
          }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                verifyEmail: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false);
          expect(error).toBe('Verification not found.');
        });
    });
  });
});
