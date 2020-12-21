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

### Code First 로 graphql 요청 연결 예제

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
