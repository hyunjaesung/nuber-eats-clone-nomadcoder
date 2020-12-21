import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';
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
    RestaurantsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
