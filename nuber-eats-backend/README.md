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

### Code First 로 graphql 연결 예제

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
