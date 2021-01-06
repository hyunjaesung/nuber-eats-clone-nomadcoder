import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMapping,
  RequestMethod,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'; // * 는 있는거 모두 import 하는거라 export 모듈 안해도 가지고온다
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { EmailVerification } from './users/entities/emailVerification.entity';
import { MailModule } from './mail/mail.module';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { Category } from './restaurants/entities/category.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { Dish } from './restaurants/entities/dish.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { OrdersModule } from './orders/orders.module';
import { CommonModule } from './common/common.module';

@Module({
  // 그래프 QL 설정
  // https://docs.nestjs.com/graphql/quick-start
  // npm i @nestjs/graphql graphql-tools graphql apollo-server-express
  // 스키마 에러 Apollo Server requires either an existing schema, modules or typeDefs

  // nestjs의 그래프 ql은 아폴로 서버를 기반으로 동작한다

  // 스키마 연결은 Code First 로 작업하면 편하다
  // - autoSchemaFile 옵션
  // - resolver 찾아서 쿼리로 연결 후 스키마 형성
  // - 타입스크립트 타입 체계아래서 자동으로 .gql 파일 생성
  // - 같은 루트 폴더 안에 있어야 자동 인식 동작 주의
  // - http://localhost:3000/graphql 들어가면 스키마 연결 확인가능

  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true, // code First
      // join(process.cwd(), 'src/schema.gql') 로하면 파일생성
      installSubscriptionHandlers: true,
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';
        if (req) {
          return { token: req.headers[TOKEN_KEY] };
          // return { user: req['user'] };
          // ws 랑 같이 쓸때는 jwt미들웨어가 user 못 넣어주므로 header 를 보내자
        } else if (connection) {
          return { token: connection.context[TOKEN_KEY] };
          // connection.context 에 토큰 들어있음
          // context 는 http의 헤더랑 비슷
        }
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        // env 값 검증
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test'),
        // NODE_ENV 유효성 검사해서 더높은 보안 제공
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_DATABASE: Joi.string(),
        PRIVATE_KEY: Joi.string(),
        MAILGUN_API_KEY: Joi.string(),
        MAILGUN_DOMAIN: Joi.string(),
        MAILGUN_FROM_EMAIL: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT, // postgres 앱에서 서버확인가능
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD, // 로컬호스트에서는 안써도된다
      database: process.env.DB_DATABASE,
      synchronize: process.env.NODE_ENV !== 'prod', // 어플리케이션 상태로 DB migration
      logging:
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      entities: [
        User,
        EmailVerification,
        Restaurant,
        Category,
        Dish,
        Order,
        OrderItem,
      ],
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    UsersModule,
    // CommonModule,
    RestaurantsModule,
    AuthModule,
    OrdersModule,
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
// implements NestModule
export class AppModule {
  // 루트모듈에 미들웨어 설치
  // 미들웨어는 어떤 모듈이나 설치 가능
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(JwtMiddleware).forRoutes({
  //     path: '/graphql',
  //     method: RequestMethod.POST,
  //   });
  // 특정 루트 특정 메서드 미들웨어 지정 가능
  // consumer.apply(JwtMiddleware).exclude({
  //   path: '/블라블라',
  //   method: RequestMethod.ALL,
  // });
  // 제외도 가능
  // }
}
