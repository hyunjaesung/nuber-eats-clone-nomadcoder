# nuber-eats-clone-nomadcoder

## #0 introduction

### gitignore 익스텐션 이용

- extenstion 가서 다운로드
- 톱니 누르고 command palete
- '>' gitignore 클릭
- node 클릭하면 node 관련 gitignore 자동 생성

## #1 GRAPHQL API

### nestjs graphql 설치

```
$ npm i @nestjs/graphql graphql-tools graphql apollo-server-express
```

### Code First 로 graphql Resolver 연결 예제

```
GraphQLModule.forRoot({
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  // true 로 하면 그냥 메모리에서 동작
}),
```

```
// src/app.module.ts
imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true, // code First
      // join(process.cwd(), 'src/schema.gql') 로하면 파일생성
    }),
    RestaurantsModule,
  ],
```

```
// src/restaurants/restaurant.module.ts

import { Module } from '@nestjs/common';
import { RestaurantResolver } from './restaurants.resolver';

@Module({
  providers: [RestaurantResolver],
})
export class RestaurantsModule {}

```

```
// src/restaurants/restaurant.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class RestaurantResolver {
  @Query((returns) => Boolean)
  // 타입을 반환하는 함수가 인자가 되야한다
  // returns 는 그냥 potato
  isPizzaGood() {
    return true;
  }
}
```

### @nestjs/graphql 주요 decorator

- Resolver : GraphQL 요청을 스키마로 변환시키는 역할

- ObjectType : GraphQL 요청으로 호출될 Object 스키마 정의
- Field : key이름 정의

- Query : Resolver에서 변환된 GraphQL 스키마를 호출 함수 이름따라 호출 시켜준다
- Args : 메서드에 전해진 인자안의 값 넣어준다

- DTO 선언

  - InputType : object 타입 정의, 타입만 쓰고 변수 이름은 후에 이용시 따로 붙여줘야한다, 호출시에 좀 귀찮다
    // @Args(이름)
  - ArgsType : 독립된 Args 타입으로서 동작하게 정의

- Mutation : Resolver에서 변환된 GraphQL 스키마를 호출 함수 이름따라 데이터 수정 시켜준다

### Mutation Argument 검증

- npm install class-validator class-transformer
- main.ts 에 파이프라인 적용

```
app.useGlobalPipes(new ValidationPipe());
```

- 원히는 @Field 데코레이터 아래 검증 데코레이터 적용

## #2 DataBase

### PostgreSQL

- PostgreSQL 설치
  - https://postgresapp.com/ -> 맥 os 전용
    - 시각화된 postgres
  - https://eggerapps.at/postico/
    - postico
- postico
  - postgres 구동중이여야한다
  - SQL 문 작성안해도 DB 설정가능하게 도와준다
  - 생성
    - localhost, 포트는 쓰지말고
  - 왼쪽 상단 localhost 코끼리 누르면 DB관리 나온다
- postgres
  - postico에서 DB추가하면 추가되는걸 확인가능
  - DB더블클릭하면 터미널열린다
  - \du 하면 유저이름 볼수있다
  - 유저 비밀번호 변경
    ```
    ALTER USER 유저이름 WITH PASSWORD '원하는 비번';
    ```

### TypeORM

- https://typeorm.io/#/
- TypeORM 을 쓰면 타입을 써주면 직접 SQL쓰지 않아도 어플리케이션과 DB 소통하게 도와준다
- Typescript에 친화적
- 다른 ORM보다 좀 더 포괄적
  - mongoose 도 있고
  - squelize 도 있다
- 설치
  ```
  npm install --save @nestjs/typeorm typeorm pg
  // pg는 postgres
  // mysql 쓸거면 mysql
  ```
- 설정

  ```
  // app.module에 추가
  import {TypeOrmModule} from '@nestjs/typeorm'

  TypeOrmModule.forRoot({
      욥션 추가
    })

  ```

  ```
  {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "test",
    "password": "test",
    "database": "test",
    "synchronize": true,
    "logging": false,
    "entities": [
      "src/entity/**/*.ts"
    ],
    "migrations": [
      "src/migration/**/*.ts"
    ],
    "subscribers": [
      "src/subscriber/**/*.ts"
    ]
  }
  ```

  ```
  TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432, // postgres 앱에서 서버확인가능
      username: 'stevesung',
      password: '12345', // 로컬호스트에서는 안써도된다
      database: 'nuber-eats',
      synchronize: true, // 어플리케이션 상태로 DB migration
      logging: true,
    }),
  ```

### @nestjs/config 로 설정하기

- 설치
  ```
  npm i --save @nestjs/config
  ```
- 내부에서 .env 동작중
- 환경별 env 분기처리

  - 원하는 환경대로 .env 생성
  - package.json 수정

    ```
    npm i cross-env 설치
    // cross-env 를 쓰면 OS에 맞게 쉘스크립트 변환해서 env값 넣어준다
    // 이런식으로 스크립트 변경
    "start": "cross-env NODE_ENV=prod nest start",
    "start:dev": "cross-env NODE_ENV=dev nest start --watch",
    ```

- 설정
  ```
  // app.module 에 추가
  ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
    }),
  ```
  ```
  //.env.dev
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=stevesung
  DB_PASSWORD=12345
  DB_DATABASE=nuber-eats
  ```
  ```
  TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT, // postgres 앱에서 서버확인가능
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD, // 로컬호스트에서는 안써도된다
      database: process.env.DB_DATABASE,
      synchronize: true, // 어플리케이션 상태로 DB migration
      logging: true,
    }),
  ```
- joi 로 config 유효성 검사
  - https://docs.nestjs.com/techniques/configuration#schema-validation
  - 설치
    ```
    npm install joi
    import * as Joi from 'joi';
    ```
  - 설정
    ```
    ConfigModule.forRoot({
      ...
      validationSchema: Joi.object({
        // env 값 검증
        // env 키값 : Joi.메서드()
        NODE_ENV: Joi.string().valid('dev', 'prod'),
        // NODE_ENV 유효성 검사해서 더높은 보안 제공
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
    }),
    ```
