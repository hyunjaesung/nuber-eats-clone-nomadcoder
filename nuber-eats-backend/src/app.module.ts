import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'; // * 는 있는거 모두 import 하는거라 export 모듈 안해도 가지고온다
import { RestaurantsModule } from './restaurants/restaurants.module';
import { Restaurant } from './restaurants/entities/restaurant.entity';
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
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        // env 값 검증
        NODE_ENV: Joi.string().valid('dev', 'prod'),
        // NODE_ENV 유효성 검사해서 더높은 보안 제공
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_DATABASE: Joi.string(),
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
      logging: process.env.NODE_ENV !== 'prod',
      entities: [Restaurant],
    }),
    RestaurantsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
