# nuber-eats-clone-nomadcoder - Backend

## #0 introduction

### gitignore 익스텐션 이용

- extenstion 가서 다운로드
- 톱니 누르고 command palete
- '>' gitignore 클릭
- node 클릭하면 node 관련 gitignore 자동 생성

### nestJS의 컨셉

- 의존성 주입
  - https://poiemaweb.com/angular-service
  - 의존성 주입은 의존 관계를 긴밀한 결합(Tight Coupling)에서 느슨한 결합(Loose Coupling)으로 의존 관계를 전환하기 위해 구성 요소 간의 의존 관계를 코드 내부가 아닌 외부의 설정 등을 통해 정의하는 디자인 패턴 중의 하나로서 구성 요소 간 결합도를 낮추고 재사용성을 높인다.
  - 프레임워크에게 의존성 인스턴스를 요구하고 프레임워크가 생성한 인스턴스를 전달받아 사용하는 방식
- Providers

  - https://docs.nestjs.com/providers
  - 의존성 주입을 할수 있다
    - 다른 것들과 많은 관계를 가질 수 있다
    - 런타임 중에 인스턴스들이 엮여 나감
  - @Injectable() 는 Nest Provider임을 보여주는 데코레이터

- 인스턴스들은 죄다 형성후 변화가 공유가되는 싱글톤 형태다

- Module
  - providers : 이 모듈 안에서 공유되고 쓰여질 의존성 주입될 인스턴스
  - export : 공유 되는 인스턴스 중에 밖으로 나갈것
  - import : 이 모듈에서 쓰일 provider를 내보내는 모듈 리스트

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
    // @PrimaryGeneratedColumn() creates a primary column which value will be automatically generated with an auto-increment value.
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

- update 메서드 이용

  - id와 업데이트 원하는 object

  ```
  // restaurant.service
  updateRestaurant({ id, data }: UpdateRestaurantDto) {
    this.restaurants.update(id, { ...data });
  }

  // restaurant.resolver
  @Mutation((_) => Boolean)
  async updateRestaurant(
    @Args('URInput') updateRestaurantDto: UpdateRestaurantDto,
  ) {
    try {
      await this.restaurantService.updateRestaurant(updateRestaurantDto);
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

- PartialType

  ```
  @InputType()
  class UpdateRestaurantInputType extends PartialType(
    CreateRestaurantDto,
  ) {}
  // Restaurant로 안하고 CreateRestaurantDto로하는 이유는 id가 꼭필요하기 때문
  // Restaurant로 하면 id가 optional 이된다
  // id는 따로 처리해서 필수로 가져오도록 작업

  @InputType()
  export class UpdateRestaurantDto {
    @Field((type) => Number)
    id: number;

    @Field((type) => UpdateRestaurantInputType)
    data: UpdateRestaurantInputType;
  }
  // id 있는거랑 없는거랑 통합
  ```

### 그외 범용 entity 설정

- class-validator 설정으로 entity 도 검증가능하다
- DTO 해당항목 not required 로 하고싶을때
  ```
  @Field((_) => Boolean, { defaultValue: true })
  // 그래프QL 스키마를 위해서 기본값 설정
  // DTO에 자동으로 true라고 add해줌
  // nullable:true 로 하면 아예 값없이 전달
  @Column({ default: true })
  // DB를 위해서 기본값 설정
  @IsOptional()
  // class-validator 를 위한 옵셔널 설정, 있거나 말거나
  @IsBoolean()
  isVegan?: Boolean;
  ```
  - 3번씩 테스트 해봐야 한다

### 참고

- 클래스 타입선언 : https://www.sitepen.com/blog/advanced-typescript-concepts-classes-and-types

## #4 User Module 작업

### 세팅 순서

- nest g mo users
- entity, graphql 쿼리
  - entity 생성
  - entity app.module에 연결
- graph ql root 쿼리 스키마 연결
  - resolver 생성 service 생성
  - users.module에 providers 연결
- TypeOrm repository 연결
  - users.module에 entity 연결한 TypeOrm 모듈 import 연결해서 repository 쓰게 작업
  - resolver, service에 순차적으로 repository 주입
- entity mapType 확장 dto
  - entity map 작업
  - 후에 서비스 작업하면서 필요한 dto extends entity로 생성

### Entity 자동 날짜 생성

https://typeorm.io/#/entities/special-columns

```
@CreateDateColumn()
  createdAt:Date;

  @UpdateDateColumn()
  updatedAt:Date;
```

### Mapped Entity에 Enum 써서 속성 제한하기

```
enum UserRole {
  Client,
  Owner,
  Delivery,
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

export class User extends CoreEntity {
  ...
  @Field((type) => UserRole)
    @Column({
      type: 'enum',
      enum: UserRole,
    })
    role: UserRole;
}
```

### 비밀번호 해싱

- TypeOrm의 Listener 이용

  - https://typeorm.io/#/listeners-and-subscribers
  - @BeforeInsert 이용 하면 생성 다 끝내고 DB에 entity insert 되기 직전에 저걸 불러서 처리가능

- bcrypt npm 모듈 이용

  - npm i bcrypt @types/bcrypt

- 설정
  ```
  // user.entity
  export class User extends CoreEntity {
  ...
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      console.log(this.password);
      this.password = await bcrypt.hash(this.password, 10);
      console.log(this.password);
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException();
    }
  }
  ```

### nest 제공기능으로 jwt 기능 만들기

- nest/passport를 이용하면 더쉽다

  - https://docs.nestjs.com/security/authentication#implementing-passport-strategies

### 사용자 정의 모듈로 JWT기능 만들기

- json web token 모듈 사용 한 방법
  - https://www.npmjs.com/package/jsonwebtoken
  - npm i jsonwebtoken
  - npm i @types/jsonwebtoken
- 설정

  - privateKey 설정

    ```
    var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256'});
    ```

    - 유저가 임의로 Token 조작했는지 알아보기위해서

    ```
    // .env.dev
    ...
    SECRET_KEY=랜덤랜덤

    // app.module
    ConfigModule.forRoot({
      ...
      validationSchema: Joi.object({
        // env 값 검증
        NODE_ENV: Joi.string().valid('dev', 'prod'),
        // NODE_ENV 유효성 검사해서 더높은 보안 제공
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_DATABASE: Joi.string(),
        SECRET_KEY: Joi.string(), // 추가
      }),
    }),

    // users. service
    export class UsersService {
      constructor(
        ...
        private readonly config: ConfigService,
        // 설정값 쓰기위해 ConfigService inject
        // 글로벌 설정해놔서 따로 import 없이 바로 사용 가능
      ) {}
      // 설정하고 요청하면 주는게 nestJS의 컨셉

      async login({
        email,
        password,
        }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
        ...
      // 토큰 생성
      const token = jwt.sign({ id: user.id }, this.config.get('SECRET_KEY'));
      // 누구나 decode 가능하므로 중요 데이터는 넣으면 안된다

      return {
        ok: true,
        token: '14324134',
      };
    } catch (error) {
      return { error, ok: false };
    }
    }
    }
    // 위에서 볼수 있는 핵심 nestJS 컨셉은 모듈에서 설정하고 서비스에 주입 하는 컨셉
    ```

- jwt 동적 모듈을 만들어서 쓰는 방법

  ```
  nest g mo jwt
  ```

  - nestJS 모듈은 두 종류가 종류함
    - static module
      - 설정이 따로 안되어있는 일반적으로 만들어서 쓰는 모듈
    - dynamic module
      - 설정이 따로 적용되어있는 모듈
      - ConfigModule GraphQLModule 같은 것
      - dynamic module은 중간과정이고 결국에는 static module이 된다
  - JWT 동적 모듈 생성
    ```
      nest g s jwt
    // jwt.module
    @Module({})
    export class JwtModule {
      static forRoot(): DynamicModule {
        return {
          module: JwtModule,
          exports: [JwtService],
          // JwtService를 Export해서 다른 모듈에서도 사용 할수 있게 함
          providers: [JwtService],
        };
      }
    }
    // jwt.service
    @Injectable()
    export class JwtService {
      hello() {
        console.log('hello');
      }
    }
    ```

- Jwt 동적 모듈에서 export한 Service users모듈에서 써보기

  ```
  // app.module
  JwtModule.forRoot(),
  // forRoot() 써서 Service 자동 exports 된다

  // users.module
  import:[JwtService]
  // 이렇게 import 요청만 하면 바로 쓸수 있다

  // users.service
  export class UsersService {
    constructor(
      ...
      private readonly jwtService: JwtService,
    ) {}
    ...
  }
  // 문제는 에러가 난다
  // global 모듈이 아니면 providers에도 넣어줘야 되기 때문
  // import 하고 module providers에 등록해서 서비스 기능 이용 하는 컨셉
  // 이게 싫으면  global 모듈로 기능하게 하면 굳이 import 안해도 된다

  // jwt.module
  @Global() // 이거 선언하면 바로 글로벌 된다
  @Module({})
  export class JwtModule {
    static forRoot(): DynamicModule {
      return {
  ```

- Jwt 모듈 옵션 기능

  ```
  // jwt.interface
  export interface JwtModuleOptions {
    privateKey: string;
  }

  // jwt.module
  export class JwtModule {
    static forRoot(options: JwtModuleOptions): DynamicModule {
      return {
        module: JwtModule,
        exports: [JwtService],
        // JwtService를 Export해서 다른 모듈에서도 provider 사용 할수 있게 함
        providers: [
          // {
          //   provide: JwtService,
          //   useClass: JwtService,
          // }
          // 그냥 JwtService 라고 쓰면 이 상태와 동일

          // 아래와 같이 provider 생성 가능
          {
            provide: 'banana', // provider 이름
            useValue: options, // 그 value
            // useClass 쓰면 class inject가능
          },
        ],
      };
    }
  }
  // jwt.service
  @Injectable()
  export class JwtService {
    constructor(
      @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions, // 커스텀 provider 주입 // private readonly configService: ConfigService,
    ) {}
    // 이렇게 따로 값을 inject 가능
    sign(payload: object): string {
      return jwt.sign(payload, this.options.privateKey);
      // return jwt.sign(payload, this.configService.get('PRIVATE_KEY'));
      // 사실 옵션안하고 위에서 처럼 그냥 글로벌 모듈에 속한 provider인 ConfigService 주입해서 쓰면되긴한다
    }
  }


  // app.module
   JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),

  // user.service

  const token = this.jwtService.sign({ id: user.id });

  ```

### JWT 인증 미들웨어

- 사용자가 http 헤더에 토큰을 넣어서 요청하면 미들웨어가 express next처럼 인증 하고 처리해야한다

  - https://docs.nestjs.com/middleware#middleware

- 미들웨어 설정

  ```
  // jwt.middleware
  import { NestMiddleware } from '@nestjs/common';
  import { Request, Response, NextFunction } from 'express';

  // export class JwtMiddleware implements NestMiddleware {
  //   // implements 는 extends와 다르게 클래스가 interface 처럼 동작 해야한다
  //   use(req: Request, res: Response, next: NextFunction) {
  //     console.log(req.headers);
  //     next();
  //   }
  // }

  // nest 데코레이터를 사용안하면 이렇게 함수로 만들어도 된다
  export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers);
    next();
  }
  ```

- 미들웨어 적용

  ```
  // 첫번째 방법 app.module 에 설정
  export class AppModule implements NestModule {
    // 루트모듈에 미들웨어 설치
    // 미들웨어는 어떤 모듈이나 설치 가능
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(jwtMiddleware).forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
      // 특정 루트 특정 메서드 미들웨어 지정 가능
      // consumer.apply(JwtMiddleware).exclude({
      //   path: '/블라블라',
      //   method: RequestMethod.ALL,
      // });
      // 제외도 가능
    }
  }

  // 두번째 방법 main.ts에 설정, 함수만 등록가능
  async function bootstrap() {
    // 모든게 App module 로 합쳐진다
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.use(jwtMiddleware);
    await app.listen(3001);
  }
  bootstrap();
  ```

- 미들웨어 jwt 인증 기능 확장

  - 중간에 http 헤더에서 토큰 받아서 해독해서 id로 DB에서 해당 유저 정보 꺼내오기

  ```
  // jwt.service
  @Injectable()
  export class JwtService {

    ....
    verify(token: string) {
      return jwt.verify(token, this.options.privateKey);
      // https://www.npmjs.com/package/jsonwebtoken
      // Returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error.
    }
  }
  // users.service
  @Injectable()
  export class UsersService {
    ...
    async findById(id: number): Promise<User> {
      return this.users.findOne({ id });
    }
  }

  // jwt.middleware
  @Injectable()
  export class JwtMiddleware implements NestMiddleware {
    // implements 는 extends와 다르게 클래스가 interface 처럼 동작 해야한다
    constructor(
      private readonly jwtService: JwtService, // 글로벌 모듈이라서 의존성 주입 바로된다
      private readonly userService: UsersService, // user.module이 export 해야 쓸수 있음
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
      if ('x-jwt' in req.headers) {
        const token = req.headers['x-jwt'];
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          try {
            const user = await this.userService.findById(decoded['id']);
            req['user'] = user;
            // req 안에 새로운 걸 넣은 것
          } catch (error) {}
        }
      }
      next();
    }
  }
  ```

### 인증과 인가

- GraphQL Context
  - 아폴로에 있는 context property에 request 마다 넣게되고 resolver 에서 공유가능
  ```
   // app.module.ts
  GraphQLModule.forRoot({
      ...
      context: ({ req }) => ({ user: req['user'] }),
      // 실행 콘텍스트에 추가 가능
    }),
  ```
- Guard를 이용한 설정

  - https://docs.nestjs.com/guards
  - https://docs.nestjs.com/graphql/other-features#execution-context

  ```

  // auth.guard.ts
  @Injectable()
  // Guard 를 이용하면 Endpoint 보호 가능
  export class AuthGuard implements CanActivate {
    // CanActivate 은 return true면
    // request 계속 진행 시키고
    // 아니면 request 중단 시킴

    canActivate(context: ExecutionContext) {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      // http 요청과 gql 형태 달라서 변형
      const user = gqlContext['user'];
      console.log(user);
      if (!user) {
        return false;
      }
      return true;
    }
  }

  // user.resolver.ts
  @Query((returns) => User)
  @UseGuards(AuthGuard) // 가드 적용 false 리턴이면 해당 쿼리 request 중단
  me(@Context() context) {}
  ```

- 커스텀 데코레이터를 이용한 설정

  ```
  // 역할 따라 다르게 쿼리 데이터 전달 할수 있는 장점 있다
  // auth-user.decorator.ts
  export const AuthUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      // http 요청과 gql 형태 달라서 변형
      const user = gqlContext['user'];
      return user;
    },
  );

  @Query((returns) => User)
    @UseGuards(AuthGuard) // 가드 적용 false 리턴이면 해당 쿼리 request 중단
    me(@AuthUser() authedUser: User) {
      return authedUser;
    }
  ```

### 유저 프로필

- 프로필 업데이트

  ```
  // edit-profile dto
  @ObjectType()
  export class EditProfileOutput extends CoreOutput {}

  @InputType()
  export class EditProfileInput extends PartialType(
    PickType(User, ['email', 'password']),
  ) {}

  //user.service
  async editProfile(userId: number, editProfileInput: EditProfileInput) {
    // {email, password} 방법 쓰면 값을 안넣으주면 undefined되는 문제가 있다
    return this.users.update({ id: userId }, { ...editProfileInput });
  }

  //user.resolver
  @UseGuards(AuthGuard)
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() authedUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      await this.usersService.editProfile(authedUser.id, editProfileInput);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }


  export class User extends CoreEntity {
  @BeforeInsert()
  @BeforeUpdate() // 업데이트시 이거 추가해야 해당칼럼 해쉬화 된다!
  async hashPassword(): Promise<void> {
    ...
  }

  // BeforeUpdate() 를 해도 해쉬화가 안되는 문제 있다
  // user.service
  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.users.findOne(userId);
    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = password;
    }
    return this.users.save(user);
    // return this.users.update(userId, {...editProfileInput})
    // update 메서드는 단순히 DB 변경만 하기때문에 entity에서 @BeforeUpdate가 동작하지 않는다
    // save는 있으면 추가하고 없으면 update 한다 이때 entity를 통과한다
  }
  ```

- 위 방법으로 그냥 save쓰면 sideEffect 발생한다

  - 비밀번호가 계속 해싱되서 다른 비밀번호로 바뀐다

  ```
  // user.entity

  @Field((type) => String)
  @Column({ select: false })
  // select false 하면 user 레포 소환시 password 안 담아 준다
  @IsString()
  password: string;

  ...

  @BeforeInsert()
  @BeforeUpdate() // 업데이트시 이거 추가해야 해당칼럼 해쉬화 된다!
  async hashPassword(): Promise<void> {
    if (this.password) {
      // password 가 안에 있을 경우만 업데이트
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.warn(e);
        throw new InternalServerErrorException();
      }
    }
  }
  // 비밀번호가 필요할때는
  // user.service.ts

  const exists = await this.users.findOne(
        {
          email,
        },
        { select: ['password'] },
      );
    // select로 가져오는 경우는 이렇게 명시적으로 가져와야되는데 여기서는 password만 가지고 오게된다
    // 필요한 것 다 써줘야한다
  ```

- 내 생각에는 그냥 update 쓰면 될듯한데..

### Email Verification 모듈 만들기

- 기본 제공 모듈 사용 하면 더 편하다
- relations : https://typeorm.io/#/relations

  - one to one : A <-> B 오직 서로 하나만 갖는다
    - https://typeorm.io/#/one-to-one-relations

  ```
  // emailVerification.entity.ts
  // 엔티티 생성하면 DB가보면 레포지토리 하나 더 생긴다!
  @InputType({ isAbstract: true }) // DTO 작업 맨위에 있어야한다
  @ObjectType()
  @Entity()
  export class EmailVerification extends CoreEntity {
    // one to one 오직 하나의 유저, 오직 하나의 EmailVerification 서로 관계
    @Column()
    @Field((type) => String)
    code: string;

    // JoinColumn은 어디서 내가 접근 하고싶은지 에 따라서 넣는 Entity가 달라진다
    // 여기에 넣으면 EmailVerification 부터 User로 관계 찾는다
    @OneToOne((type) => User, { onDelete: 'CASCADE' })
    // CASCADE는 user가 지워지면 같이 지워지는 옵션
    @JoinColumn()
    user: User;
  }

  // user.entity.ts
  @Column({ default: false })
  @Field((type) => Boolean)
  verified: boolean;
  // 대응할 칼럼 추가

  // app.module
  // TypeOrm Module에 Entity 추가

  ```

  ```
  // user.service

  // emailVerification 레포지토리 연결 후 이용
  const verification = await this.emailVerification.findOne(
      { code },
      // { loadRelationIds: true },
      { relations: ['user'] },
      // 위 둘 옵션 있어야지 relation 관련 컬럼 가지고 온다
      // relation은 상당히 복잡한 작업이기 때문에 옵션으로 요청을 해야한다
    );
  ```

- 랜덤 문자 만들기

  ```
    Math.random().toString(36);
  ```

- mailgun 으로 인증 코드 보내기

- nestjs에서 제공하는 mailer 이용하면 쉽게 이용 가능하다
