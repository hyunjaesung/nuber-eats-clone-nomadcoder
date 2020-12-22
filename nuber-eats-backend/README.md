# nuber-eats-clone-nomadcoder - Backend

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

## #3 TYPEORM AND NEST

### entities

https://typeorm.io/#/entities

- Entity is a class that maps to a database table

- decorator

  - Entity : typeOrm이 DB에 이걸 저장할 수 있게한다

- 설정

  - 기존 GraphQL의 ObjectType 설정한 곳에 같이 설정할 수 있다

  ```
  @ObjectType() // Object Type 리턴 만들어줌 Resolver로 연결
  @Entity()
  export class Restaurant {
    @PrimaryGeneratedColumn()
    @Field((_) => Number)
    id: number;

    @Field((_) => String)
    @Column()
    name: string;
    @Field((_) => Boolean)
    @Column()
    isVegan?: Boolean;
    @Field((_) => String)
    @Column()
    address: string;
    @Field((_) => String)
    @Column()
    ownerName: string;
  }
  ```

  - DB 가보면 Entity에 들어가지 않았는데 TypeORM에 따로 어디잇는지 알려줘야한다
    ```
    TypeOrmModule.forRoot({
      ...
    entities: [Restaurant],
    }),
    ```
    - 실행하면 SQL문 잔뜩 실행되는데 이는 synchronize true로 해놔서 entity 자동으로 찾고 migration이 자동으로 된다
      ```
      // 환경따라 추가 설정
      // 배포 상태에서는 실제 데이터라서 따로 작업하고 싶을수 있다
      synchronize: process.env.NODE_ENV !== 'prod'
      ```

### 서비스 에서 DB 정보 읽기 쓰기

- Data Mapper vs Active Record
  https://typeorm.io/#/active-record-data-mapper
- Data Mapper 방식

  - Repository 사용
    - Repository가 제공하는 모듈들을 이용 가능
    - 어느 환경이나 접근이 가능해서 실제 구현 서비스, 테스팅 환경 모두에서 접근이 가능하다는 장점

- 설정

  ```
  // restaurant.module
  @Module({
    imports: [TypeOrmModule.forFeature([Restaurant])],
    // forFeature 는 특정 feature를 import 할수있도록 한다
    // 1. TypeOrmModule 을 써서 Restaurant Repository를 모듈에 import 하면 RestaurantResolver에서 Repository 이용가능
    providers: [RestaurantResolver, RestaurantService],
    // providers에 RestaurantService 넣어야 다른 class로 inject 가능하다
  })
  // 2. RestaurantService에서 Repository 를 쓰기 위해서는 RestaurantResolver에 RestaurantService 주입하고 Repository 주입해줘야 된다

  // restaurant.resolver
  export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) {}
    ...
    restaurants(): Promise<Restaurant[]> {
      return this.restaurantService.getAll();
  }
  ...

  // restaurant.service
  @Injectable()
  export class RestaurantService {
    constructor(
      @InjectRepository(Restaurant)
      private readonly restaurant: Repository<Restaurant>,
    ) {}
    // RestaurantResolver부터 Repository 주입 요청
    // typeORM 문서에 나오는 getRepository 메서드를 데코레이터가 대신 해준다

    getAll(): Promise<Restaurant[]> {
      return this.restaurant.find();
      // Repository 이용하면 DB 관련 각종 메서드 이용가능!
    }
  }
  ```

- create, save 메서드 이용

  ```
  // restaurant.service
  createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    const newRestaurant = this.restaurants.create(
      // {
      //     name:createRestaurantDto.name
      // }
      // 원래는 이런식으로 사용해야되지면 이미 Dto를 선언해놔서 그거쓰면된다
      createRestaurantDto,
    );
    return this.restaurants.save(newRestaurant);
  }

  // restaurant.resolver
  @Mutation((returns) => Boolean)
  async createRestaurant(
    // @Args('name') name: string,
    // @Args('isVegan') isVegan: boolean,
    // @Args('address') address: string,
    // @Args('ownerName') ownerName: string,
    // 아래와 같이 따로 DTO 선언해서 축소가능
    @Args() createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.createRestaurant(createRestaurantDto);
      return true;
    } catch (e) {
      console.warn(e);
      return false;
    }
  }
  ```

### Mapped Types

https://docs.nestjs.com/graphql/mapped-types#mapped-types

- Dto에 없고 Entity에만 있으면 경고도 없고 아무도 모르게 에러가 난다 이를 예방하려면 계속 동기화가 되어 있어야 하는데 Entity가 Dto도 자동 수행하도록 하면 된다. Entity가 DB table, graphql type 뿐만 아니라 dto 모두 가능하도록 수정
- Mapped Types은 base type을 기반으로 여러 type을 만들어준다
  - Partial : required가 아닌 방식으로 전체로 생성
  - Pick : 특정 타입만 가져다가 생성
  - Omit : 몇몇만 제외하고 만든다
  - Intersection : 합쳐서 생성
- 중요한 점은 이것들은 inputType으로 동작 되므로 다른 티입 아닌 inputType써야된다
- OmitType
  ```
  @InputType() // MappedType에서는 InputType
  // @ArgsType()
  export class CreateRestaurantDto extends  OmitType(
    Restaurant,
    ['id'],
    InputType,
  ) {
    // 생성되는 id는 제외
    // 부모인 Restaurant는 InputType이 아닌   ObjectType이라서 처리 필요
    // 이런 경우 마지막 인자로 변환 시킬 타입 넣어  줄수 있다
    // 저렇게 안쓰고싶을 경우 해당 스키마 entity에 isAbstract true 로 InputType 추가해도된다
    // @InputType({ isAbstract: true })
  }
  ```
