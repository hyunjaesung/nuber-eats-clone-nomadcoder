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
    - 팁 : export 하는 Service 다른데 서 쓰려면 해당 Module을 import 해야한다

## #1 GRAPHQL API

### nestjs graphql 설치

```
$ npm i @nestjs/graphql graphql-tools graphql apollo-server-express
```

### Code First 로 graphql Resolver 연결 예제

```{typescript}
GraphQLModule.forRoot({
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  // true 로 하면 그냥 메모리에서 동작
}),
```

```{typescript}
// src/app.module.ts
imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true, // code First
      // join(process.cwd(), 'src/schema.gql') 로하면 파일생성
    }),
    RestaurantsModule,
  ],
```

```{typescript}
// src/restaurants/restaurant.module.ts

import { Module } from '@nestjs/common';
import { RestaurantResolver } from './restaurants.resolver';

@Module({
  providers: [RestaurantResolver],
})
export class RestaurantsModule {}

```

```{typescript}
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
- 데코레이터 : https://typeorm.io/#/decorator-reference
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

  ```{typescript}
  // app.module에 추가
  import {TypeOrmModule} from '@nestjs/typeorm'

  TypeOrmModule.forRoot({
      욥션 추가
    })

  ```

  ```
  // mysql 쓸때 옵션
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

  ```{typescript}
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
  ```{typescript}
  // app.module 에 추가
  ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
    }),
  ```
  ```{typescript}
  //.env.dev
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=stevesung
  DB_PASSWORD=12345
  DB_DATABASE=nuber-eats
  ```
  ```{typescript}
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
    ```{typescript}
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

  ```{typescript}
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
    ```{typescript}
    TypeOrmModule.forRoot({
      ...
    entities: [Restaurant],
    }),
    ```
    - 실행하면 SQL문 잔뜩 실행되는데 이는 synchronize true로 해놔서 entity 자동으로 찾고 migration이 자동으로 된다
      ```{typescript}
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

  ```{typescript}
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

  ```{typescript}
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

  ```{typescript}
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

  ```{typescript}
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

  ```{typescript}
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
  ```{typescript}
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

```{typescript}
@CreateDateColumn()
  createdAt:Date;

  @UpdateDateColumn()
  updatedAt:Date;
```

### Mapped Entity에 Enum 써서 속성 제한하기

```{typescript}
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
  ```{typescript}
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

## #5 USER AUTHENTICATION

### nest 제공기능으로 jwt 기능 만들기

- nest/passport를 이용하면 더쉽다

  - https://docs.nestjs.com/security/authentication#implementing-passport-strategies

### 사용자 정의 모듈로 JWT기능 만들기

- json web token 모듈 사용
  - https://www.npmjs.com/package/jsonwebtoken
  - npm i jsonwebtoken
  - npm i @types/jsonwebtoken
- 설정

  - privateKey 설정

    ```{typescript}
    var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256'});
    ```

    - 유저가 임의로 Token 조작했는지 알아보기위해서

    ```{typescript}
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

- jwt 동적 모듈을 만들기

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

  ```{typescript}
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

  ```{typescript}
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

- @Global 시 유의 사항

  - Global 데코레이터로 Global 모듈로 만들어도 app.module에는 포함이 되어야 한다
  - Global 모듈의 provider 땡겨 쓸때도 Global 모듈 안에서 exports해야 쓸 수 있다

- Jwt 모듈 옵션 기능

  ```{typescript}
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

- provide로 provider 만들때 유의사항
  - provide에 문자열을 넣어 줘야 하고
  - 해당 provider 쓰는 곳에 @inject(문자열) 로 넣어줘야한다
    ```{typescript}
    // 예
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
    ```

### JWT 인증 미들웨어

- 사용자가 http 헤더에 토큰을 넣어서 요청하면 미들웨어가 express next처럼 인증 하고 처리해야한다

  - https://docs.nestjs.com/middleware#middleware

- 미들웨어 설정

  ```{typescript}
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

  ```{typescript}
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

  ```{typescript}
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

  ```{typescript}

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

- 커스텀 param 데코레이터를 이용한 설정

  - param decorator
    - https://docs.nestjs.com/custom-decorators

  ```{typescript}
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

  ```{typescript}
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

  ```{typescript}
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

## #6 Email Verification 모듈 만들기

### relations

- 기본 제공 모듈 사용 하면 더 편하다
- relations : https://typeorm.io/#/relations

  - one to one : A <-> B 오직 서로 하나만 갖는다

    - https://typeorm.io/#/one-to-one-relations

    ```{typescript}
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

    ```{typescript}
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

  ```{typescript}
    Math.random().toString(36);
  ```

### 메일 모듈 만들기

- 커스텀 모듈 만드는건 위 jwt 커스텀 모듈과 비슷함
  - nestjs에서 제공하는 mailer 이용하면 커스텀 모듈 없이 쉽게 이용 가능하다
- mailgun 이용 하기

  ```
  curl -s --user 'api:YOUR_API_KEY' \
  https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages \
  -F from='Excited User <mailgun@YOUR_DOMAIN_NAME>' \
  -F to=YOU@YOUR_DOMAIN_NAME \
  -F to=bar@example.com \
  -F subject='Hello' \
  // 텍스트 이용시
  -F text='Testing some Mailgun awesomeness!'
  // 템플릿 이용시
  -F template='veryfy-user'
  -F v:변수이름='변수값'
  ```

  - node.js 에는 fetch가 없으므로 패키지 설치 필요
    ```{typescript}
    npm i got
    npm i form-data // node 에서 http 폼 만들기
    ```
  - 설정

    ```{typescript}
    // mail.service
    import got from 'got';
    import * as FormData from 'form-data';
    import { Injectable, Inject } from '@nestjs/common';
    import { CONFIG_OPTIONS } from '../common/common.constant';
    import { MailModuleOptions } from './mail.interface';

    @Injectable()
    export class MailService {
      constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions, // 커스텀 provider 주입 // private readonly configService: ConfigService,
      ) {}

      //   curl -s --user 'api:YOUR_API_KEY' \
      //   https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages \
      //   -F from='Excited User <mailgun@YOUR_DOMAIN_NAME>' \
      //   -F to=YOU@YOUR_DOMAIN_NAME \
      //   -F to=bar@example.com \
      //   -F subject='Hello' \
      //   -F text='Testing some Mailgun awesomeness!'
      private async sendEmail(
        subject: string,
        content: string,
        // to:string
      ) {
        const form = new FormData();
        form.append('from', `Excited User <mailgun@${this.options.domain}>`);
        form.append('to', `stevehjsung@gmail.com`); // 원래는 인자로 받아서 넣어야함
        form.append('text', content);
        form.append('subject', subject);

        const response = await got(
          `https://api.mailgun.net/v3/${this.options.domain}/messages`,
          {
            https: {
              rejectUnauthorized: false,
            },
            headers: {
              Authorization: `Basic ${Buffer.from(
                `api:${this.options.apiKey}`,
              ).toString('base64')}`,
              // base64 형태로 포맷해서 보내야한다
            },
            method: 'POST',
            body: form,
          },
        );
      }
    }
    ```

- mailgun 관리자 페이지 template 가서 역겹게 생긴 html email 만들수 있다

  - {{변수이름}} 으로 템플릿에 변수 전달 가능

    ```{typescript}
      ...
      form.append('template', 'veryfy-user');
      form.append('v:userName', `steve`);
      form.append('v:code', `stevecode`);
      form.append('v:company', `stevecompany`);
      ...
    ```

    ```{typescript}
    // 리팩토링 까지 완료
    export class MailService {
      constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions, // 커스텀 provider 주입 // private readonly configService: ConfigService,
      ) {}

      private async sendEmail(
        subject: string,
        template: string,
        emailVars: EmailVar[],
        to: string,
      ) {
        const form = new FormData();
        form.append(
          'from',
          `Steve from SteveCompany <mailgun@${this.options.domain}>`,
        );
        form.append('to', to);
        form.append('subject', subject);
        // form.append('text', content);
        form.append('template', template);
        emailVars.forEach(({ key, value }) => form.append(key, value));
        // form.append('v:userName', `steve`);
        // form.append('v:code', `stevecode`);
        // form.append('v:company', `stevecompany`);
        try {
          const response = await got(
            `https://api.mailgun.net/v3/${this.options.domain}/messages`,
            {
              https: {
                rejectUnauthorized: false,
              },
              headers: {
                Authorization: `Basic ${Buffer.from(
                  `api:${this.options.apiKey}`,
                ).toString('base64')}`,
                // base64 형태로 포맷해서 보내야한다
              },
              method: 'POST',
              body: form,
            },
          );
        } catch (error) {
          console.log(error);
        }
      }

      sendVerificationEmail(email: string, code: string) {
        this.sendEmail(
          'Plz Verify Your Email',
          'veryfy-user',
          [
            { key: 'v:userName', value: email },
            { key: 'v:code', value: code },
            { key: 'v:company', value: 'stevecompany' },
          ],
          email,
        );
      }
    }

    ```

## #7 UNIT TESTING THE USER SERVICE

### use.service.spec.ts 스스로 만들기

- 테스트 init 세팅

  ```{typescript}
  // users.service.spec.ts

  import { Test } from '@nestjs/testing';
  import { UsersService } from './users.service';

  describe('UserService', () => {
    let service: UsersService;

    beforeAll(async () => {
      // nest 기본 제공 테스트 모듈 이용
      // 시작 전에 테스트 모듈 생성
      const modules = await Test.createTestingModule({
        providers: [UsersService],
      }).compile();

      // service를 밖으로 꺼내기
      service = modules.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it.todo('createAccount');
    it.todo('login');
    it.todo('userProfile');
    it.todo('findById');
    it.todo('editProfile');
    it.todo('verifyEmail');
  });

  ```

- 경로 에러 해결

  ```
  // Cannot find module 'src/common/entities/core.entity' from 'users/entities/user.entity.ts'
  // jest 는 ts의 경로 방식을 이해 못한다
  // package.json
  "jest": {
    "rootDir": "src",
    "moduleNameMapper": {
      "^src/(.*)$": "<rootDir>/$1"
    },
    ...
  }
  ```

- 의존성 문제 Mocking 으로 해결

  ```
  <!-- Nest can't resolve dependencies of the UsersService (?, EmailVerificationRepository, JwtService, MailService). Please make sure that the argument UserRepository at index [0] is available in the RootTestModule context. -->
  // UserService의 dependency 문제
  // UserService에 주입된 것들은 모듈안에 다 dependency 만들어 줘야한다
  // 테스트용 mock 만들어줘서 해결 하도록 하자

  // 이런 object 형태로하면 불변성 문제가 생겨서 반환하는 형태로 하도록 하자
  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockMailService = {
    sendVerification: jest.fn(),
  };

  describe('UserService', () => {
    let service: UsersService;

    beforeAll(async () => {
      const modules = await Test.createTestingModule({
        providers: [
          UsersService,
          {
            provide: getRepositoryToken(User), // 엔티티로 레포지토리 만들어줌
            useValue: mockRepository,
          },
          {
            provide: getRepositoryToken(EmailVerification), // 엔티티로 레포지토리 만들어줌
            useValue: mockRepository,
          },
          {
            provide: JwtService,
            useValue: mockJwtService,
          },
          {
            provide: MailService,
            useValue: mockMailService,
          },
        ],
      }).compile();
      ...
  ```

- 테스트를 위한 레포지토리 Mock으로 생성

  ```
  type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;
  // Repository 메서드 이름들 죄다 key로 가지고 옴

  describe('UserService', () => {
    ...
    let usersRepository: MockRepository<User>;

    beforeAll(async () => {
      ...
      usersRepository = modules.get(getRepositoryToken(User));
    });

    ...

    describe('createAccount', () => {
      it('should fail if user exists', () => {
        // 테스트로 하려면 있는 것처럼 속여야한다
      });
    });

    ...
  });
  ```

- mocking으로 테스트

  ```{typescript}
  describe('createAccount', () => {
    it('should fail if user exists', async () => {
      // 테스트를 하려면 이미 유저가 있는 것처럼 속여야한다
      // mock 함수의 반환 값을 테스트 용으로 교체해야한다

      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });
      // 이 경우 가짜 User 레포의 findOne 의 return Promise Resolve
      // 값으로 mock 값 넣어준다

      const result = await service.createAccount({
        email: '',
        password: '',
        role: 1,
      });
      // 실행 시켜서 console.log 찍어보면 findOne이 mock 반환중
      expect(result).toMatchObject({
        ok: false,
        error: '계정을 생성할수 없습니다',
      });
    });
  });
  ```

- 테스트를 위한 mocking 정리

  - 테스트를 위해서는 다 속여야 한다
  - 테스트를 원하는 UserService를 가져와서 의존성 주입된 모듈이나 서비스, 레포지토리를 mock 으로 만들어내야 한다
  - 테스트 원하는 메서드에서 사용하는 레포지토리도 mocking 하고 메서드도 mocking하고 반환값도 mock 해야한다

- coverage ignore 설정

  ```{typescript}
  // package.json
  "coveragePathIgnorePatterns": [
      "node_modules",
      ".entity.ts",
      ".constants.ts"
    ]
  ```

- createAccount 테스트 해보기

  ```{typescript}
  // users.service.spec.ts

  describe('createAccount_test', () => {
    const createAccountArg = {
      email: 'test@test.com',
      password: '',
      role: 1,
    };
    it('이미 계정이 존재하는 경우 테스트', async () => {
      // 테스트를 하려면 이미 유저가 있는 것처럼 속여야한다
      // mock 함수의 반환 값을 테스트 용으로 교체해야한다

      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });
      // 이 경우 가짜 User 레포의 findOne 의 return Promise Resolve
      // 값으로 mock 값 넣어준다

      const result = await service.createAccount(createAccountArg);
      // 실행 시켜서 console.log 찍어보면 findOne이 mock 반환중
      expect(result).toMatchObject({
        ok: false,
        error: '계정을 생성할수 없습니다',
      });
    });

    it('유저 생성 테스트', async () => {
      // 메서드 mock 데이터 설정
      usersRepository.findOne.mockResolvedValue(undefined);
      usersRepository.create.mockReturnValue(createAccountArg);
      usersRepository.save.mockResolvedValue(createAccountArg);
      verificationRepository.create.mockReturnValue({ user: createAccountArg });
      verificationRepository.save.mockResolvedValue({ code: 'testcode' });

      // 실행
      const result = await service.createAccount(createAccountArg);
      // 테스트
      // return { ok: true };

      expect(result).toEqual({ ok: true });

      // 테스트
      //   const user = await this.users.save(
      //     this.users.create({ email, password, role }),
      //   );
      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      // 몇번 호출 되는지 확인도 가능
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArg);
      // 무슨 인자로 호출 됐는지
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArg);

      // 테스트
      // const verification = await this.emailVerification.save(
      //     this.emailVerification.create({
      //       user,
      //     }),
      //   );
      expect(verificationRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: createAccountArg,
      });
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith({
        user: createAccountArg,
      });

      // 테스트
      //   this.mailService.sendVerificationEmail(user.email, verification.code);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
    });

    it('에러 처리 테스트', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createAccount(createAccountArg);
      expect(result).toEqual({ ok: false, error: '계정을 생성할수 없습니다' });
    });
  });
  ```

- mock 유저 만들어서 테스트 진행
  ```{typescript}
  // 테스트 라인
  <!-- const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      ...
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: '틀린 비밀번호',
        };
      } -->
  it('비밀번호 틀린 경우 테스트', async () => {
      // 이런 식으로도 mock 형성 가능
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(result).toEqual({ ok: false, error: '틀린 비밀번호' });
    });
  ```

## #8 UNIT TESTING JWT AND MAIL

- spyOn으로 mock 대체 하기

  ```{typescript}
  // mail.service.spec.ts

  describe('sendVerificationEmail', () => {
    ...
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => {});
      // 테스트를 위해서 sendEmail을 mock으로 만들어도 되지만
      // 이 경우 sendEmail을 테스트 할수가 없음
      // mock을 못만드는 경우는 spyOn을 쓰면 된다
      // sendEmail을 중간에 가로채서 콜백 함수로 바꾼다

      ...
      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      ...
    });
  });
  ```

- npm module mock 하기

  ```{typescript}
  jest.mock('jsonwebtoken', () => {
    return {
      sign: jest.fn(() => 'TOKEN'),
      verify: jest.fn(() => ({ id: USER_ID })),
    };
  });

  // 모듈 전체를 mock 하기
  // npm 모듈 전체를 import 하고싶다면 npm 모듈을 import 하고 두번째 인자인 콜백함수는 필요하지 않으면 안써도 된다

  import got from 'got';
  jest.mock('got');

  // 데이터 조작을 하고싶으면 spyOn 써서 하면된다
  jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error();
      });

  import * as FormData from 'form-data';
  jest.mock('form-data');

  const formSpy = jest.spyOn(FormData.prototype, 'append');
  // append는 new로 인스턴스 만든 후만 이용가능
  // prototype을 spyOn 하자
  //   const form = new FormData();
  //     form.append(
  //     'from',
  //     `Steve from SteveCompany <mailgun@${this.options.domain}>`,
  //     );

  ```

- coverage 폴더에 index.html 실행 시켜보면 html화면으로 coverage 보여준다

## #9 USER MODULE E2E

### init 설정

- ts방식 경로 에러 해결

  ```{typescript}
  // jest-e2e.json

  {
    ...
    "moduleNameMapper": {
      "^src/(.*)$": "<rootDir>/../src/$1"
    }
    // 한번 밖으로 나가서 src 찾아야 된다
  }
  ```

- db error

  ```{typescript}
  // .env.test 만들어 준다
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=stevesung
  DB_PASSWORD=12345
  DB_DATABASE=nuber-eats-test
  PRIVATE_KEY=testKey
  MAILGUN_API_KEY=...
  MAILGUN_DOMAIN=...
  MAILGUN_FROM_EMAIL=good@good.com

  // 테스트용 db도 nuber-eats-test 이름으로 postico 가서 만들어준다
  ```

- Jest did not exit one second after the test run has completed.

  ```{typescript}
  // 테스트 종료 후
  // jest 종료 시켜줘야 한다
  // db drop 시켜야한다

  afterAll(async () => {
    await getConnection().dropDatabase();
    app.close();
  });
  ```

### e2e로 resolver 메서드 테스트

- createAccount 테스트

  ```{typescript}
  describe('createAccount', () => {
      const EMAIL = 'test@test,com';
      it('계정 생성 테스트', () => {
        return request(app.getHttpServer()) // supertest 이용
          .post(GRAPHQL_ENDPOINT)
          .send({
            // http에서 grapqhql 보내는 방식으로 넣어서 query 로 요청
            query: `mutation{
                  createAccount(input:{
                    email:"${EMAIL}",
                    password:"123",
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
                    email:"${EMAIL}",
                    password:"123",
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
  ```

- e2e 요청시 http 헤더 변경
  ```{typescript}
  // set 메서드 이용
  request(app.getHttpServer())
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
  ```
- e2e 에서 레포지토리 쓰기

  ```{typescript}
  let usersRepository: Repository<User>;

  beforeAll(async () => {
   ....
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    ...
  });

  describe('userProfile', () => {
    let userId: number;
    beforeAll(async () => { // 안에서 또 beforeAll 해서 찾아옴
      const [user] = await usersRepository.find();
      userId = user.id;
    });
    it("should see a user's profile", () => {
      return request(app.getHttpServer())
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
        .expect(200)
    // 위 처럼 안하고 어짜피 하나니까 userId 1로 하고 해도된다
  ```

## #10 Restaurant

- Many Releations

```{typescript}
// category
@OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
// 두번째 인자에는 역행해서 써주기
restaurants: Restaurant[];

// restaurant
@ManyToOne((type) => Category, (category) => category.restaurants)
category: Category;
```

```{typescript}
// 하나가 지워져도 다른게 지워지면 안되는 경우
@ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL', // 카테고리가 지워지더라도 레스토랑이 지워지면 안된다
  })
  category: Category;
```

## Role에 따라 Authorization

- Authorization은 허가 Authentication은 인증

- metaData 이용으로 Authorization

  ```{typescript}
  // restaurants.resolver.ts
  enum UserRole {
    Client,
    Owner,
    Delivery,
  }

  @Mutation((returns) => CreateRestaurantOutput)
  @SetMetadata("allowedRole", UserRole.Owner) // Metadata로 구분, metaData 설정시 Reflector 이용 해서 사용가능

  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    ...
  }
  ```

- 나만의 decorator 만들어서 간단하게

  ```{typescript}
  // user.entity
  export enum UserRole {
    Client = 'Client',
    Owner = 'Owner',
    Delivery = 'Delivery',
  }

  // role.decorator.ts
  type AllowedRole = keyof typeof UserRole | 'Any';

  export const Role = (roles: AllowedRole[]) => SetMetadata('allowedRole', roles);

  // restaurant.resolver.ts
  @Resolver((of) => Restaurant)
  export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) {}
    @Mutation((returns) => CreateRestaurantOutput)
    @Role(['Owner'])
    async createRestaurant(
      @AuthUser() authUser: User,
      @Args('input') createRestaurantInput: CreateRestaurantInput,
    ): Promise<CreateRestaurantOutput> {
      ...
    }
  }
  ```

- 글로벌 가드 설정 및 요청마다 메타 데이터 설정

  ```{typescript}
  // auth.module 글로벌 가드 설정
  @Module({
    providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
    // guard를 앱 전체에서 모든 req에 사용하고싶다면 APP_GUARD 상수 사용
  })

  // 기존 인증 했던 부분들 커스텀 decorator로 메타 데이터 설정
  // user.resolver
  ...
  @Query((returns) => User)
  // @UseGuards(AuthGuard) // 가드 적용 false 리턴이면 해당 쿼리 request 중단
  @Role(['Any'])
  // 커스텀 데코레이터로 meta 데이터 설정, meta데이터 없다면 글로벌 guard에서 로그인 필요없는 것으로 구분
  me(@AuthUser() authedUser: User) {
    return authedUser;
  }

  // @UseGuards(AuthGuard)
  @Role(['Any'])
  @Query((returns) => UserProfileOutput)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return await this.usersService.findById(userProfileInput.userId);
  }
  ...
  ```

- guard와 meta데이터로 요청 인증

  ```{typescript}
  @Injectable()
  export class AuthGuard implements CanActivate {
    // CanActivate 은 return true면
    // request 계속 진행 시키고
    // 아니면 request 중단 시킴

    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
      const roles = this.reflector.get<AllowedRoles>(
        'allowedRole',
        context.getHandler(),
      ); // 메타 데이터 읽어오기

      if (!roles) {
        // resolver에 role 메타데이터 설정 안되있으면 해당 req 허가
        // 예 로그인 필요없는 경우의 요청들
        return true;
      }

      const gqlContext = GqlExecutionContext.create(context).getContext();
      // http 요청과 gql 형태 달라서 변형
      const user: User = gqlContext['user'];
      if (!user) {
        // 유저 데이터가 없는 경우 req 거부
        return false;
      }

      if (roles.includes('Any')) {
        // Any 면 모두 허가
        return true;
      }

      return roles.includes(user.role);
      // 메타 데이터와 user의 role이 일치하는 경우만 true 리턴
    }
  }
  ```

### relation id

- https://typeorm.io/#/decorator-reference/relationid
- if you have a many-to-one category in your Post entity, you can have a new category id by marking a new property with @RelationId

```{typescript}
// restaurant.entity

@Field((type) => User)
@ManyToOne((type) => User, (user) => user.restaurants, {
  onDelete: 'CASCADE',
})
owner: User;

// 확실하게 관계 표명
// loadRelationId나 relations 옵션으로 find 안해도 자동으로 relation id 가져다 준다
@RelationId((restaurant: Restaurant) => restaurant.owner)
ownerId: number;
```

### @EntityRepository

- https://typeorm.io/#/decorator-reference/entityrepository
- 커스텀 repository 만들기
  ```{typescript}
  @EntityRepository(Category)
  export class CategoryRepository extends Repository<Category> {
    async getOrCreate(name: string): Promise<Category> {
      const categoryName = name.trim().toLowerCase();
      const categorySlug = categoryName.replace(/ /g, '-');
      let category = await this.findOne({ slug: categorySlug });
      if (!category) {
        category = await this.save(
          this.create({ slug: categorySlug, name: categoryName }),
        );
      }
      return category;
    }
  }
  ```

### Parent Decorator

- GraphQL에서 Parent는 상위 항목 의미
  ```{typescript}
  {
    parent{
      children
    }
  }
  ```
- @Parent쓰면 상위 항목 이름 가지고 온다
  ```{typescript}
  @ResolveField((type) => Int)
  restaurantCount(@Parent() category: Category): Promise<number> {
    // @Parent 쓰면 restaurant count 필드의 부모인 category를 리턴해준다
    return this.restaurantService.countRestaurants(category);
  }
  ```

### typeOrm이 메서드로 지원하지 않는 SQL 문 만날 경우

```{typescript}
const [restaurants, totalResults] = await this.restaurants.findAndCount({
        where: {
          name: Raw((name) => `${name} ILIKE '%${query}%'`),
          // sql Like 문
          // typeOrm에는 대소문자 구분없음을 지원 안해주고 있다
          // ILIKE 는 Insensitive Like
          // 이런 경우 DB에 SQL문을 이용해서 직접 요청 해야한다
          // `${name} ILIKE '%${query}%'` 직접 SQL문 입력
        },
        skip: (page - 1) * 25,
        take: 25,
      });
```

## #11 DISH AND ORDER CRUD

### @ManyToMany 와 @JoinTable

- https://typeorm.io/#/decorator-reference/manytomany
- https://en.wikipedia.org/wiki/Many-to-many_(data_model)
- https://siyoon210.tistory.com/26
- ManyToMany : Many-to-many is a relation where A contains multiple instances of B, and B contain multiple instances of A
- JoinTable : Used for many-to-many relations and describes join columns of the "junction" table. Junction table is a special, separate table created automatically by TypeORM with columns referenced to the related entities. 소유 하는 쪽에 데코레이터 써줘야한다
- ManyToMany 관계는 중간에 junction table 필요
  - junction table에 일대다 다대일 관계로 연결 되어있다
- 소유 하는 쪽
  - 철수가 여러 수업을 수강한다.(O)
  - 국어, 영어, 수학은 철수를 수용 한다.(X)
    -> 철수가 소유

```{typescript}
// order.entity.ts
...
@Field((type) => [Dish])
@ManyToMany((type) => Dish)
@JoinTable()
// dish vs order 하면 order 가 소유하는 쪽이라 여기에 써줘야한다
dishes: Dish[];
...
```

### entity 작성 시 순서

1. 먼저 필요한 property부터 쓰고
2. enumType 있으면 등록하고
3. GraphQL 스키마 작성

- nullable 이면 nullable true 로

4. typeOrm 스키마 작성

- GraphQL이랑 크게 다르지 않는 것 column 으로
- 관계 필요한 항목 relations 요소 작성

  - orders <-> user : user 하나가 많은 order를 가질 수 있음
    orders에선 ManyToOne
    user에선 OneToMany
    onDelete 옵션 user지워져도 주문이 남아있어야하니 SET NULL
    user는 customer or driver

  - orders <-> restaurant : restaurant하나가 많은 order를 가짐
    위와 같은 과정

  - orders <-> dishes : order 도 많은 dish 가질수있고 dish도 여러 order 가질수 있다
    Own 하는 쪽에 @JoinTable() 써줘야한다
    order 에서 테이블로 일대다 관계 형성
    테이블 에서 dish로 다대일 관계 형성

## #12 ORDER SUBSCRIPTIONS

- SUBSCRIPTIONS
  - resolver에서 변경 사항이나 업데이트를 수신하게 해준다
  - 리얼타임 처리
- graphql-subscriptions
  - https://www.npmjs.com/package/graphql-subscriptions
  ```
  npm i graphql-subscriptions
  ```

### init 설정

```{typescript}
// resolver.ts
const pubSub = new PubSub();
// PubSub은 Publish and Subscription

@Resolver(_ => test)
  ...
  @Subscription((returns) => String)
  // 뭘 리턴하냐 에 따라 달라진다
  readyPotatoes() {
    // 여기선 String을 리턴하지 않고
    // asyncIterator 를 리턴할거다
    return pubSub.asyncIterator('hotPotatoes');
  }
  ...
```

```{typescript}
// graphQL 요청
subscription{
  hotPotatoes
}
// 결과, web socket 필요
{
  "error": "Could not connect to websocket endpoint ws://localhost:3001/graphql. Please check if the endpoint url is correct."
}
```

```{typescript}
// app.module
GraphQLModule.forRoot({
    ..
    installSubscriptionHandlers: true,
    // 이렇게 하면 GraphQL 서버 웹소켓 기능할 수 있다
    ...
  }),
```

```{typescript}
{
  "error": {
    "message": "Cannot read property 'user' of undefined"
  }
}

GraphQLModule.forRoot({
    ...
    installSubscriptionHandlers: true,
    context: ({ req }) => ({ user: req['user'] }),
    // 여기서 나는 에러
  }),

//
// Subscription 을하려는 순간 Http 를 안거치고 바로 ws 연결을 하고있음
// req 열어보면 undefined
// ws은 req가 없다 connection가 있다
```

```{typescript}
// app.module
GraphQLModule.forRoot({
    ...
    installSubscriptionHandlers: true,
    context: ({ req, connection }) => {
      if (req) { // 분기로 http랑 ws 나눠줌
        return { user: req['user'] };
      } else {
        console.log(connection);
      }
    },
  }),
// 리스닝 진행됨 확인 가능

// http는 req 마다 헤더에 넣어서 보내지만
// ws는 또 http와 다르게 연결 시작할 때 connection에 토큰을 딱 한번 보낸다
```

- 설정한 subscription 트리거 작동시키기

  ```{typescript}
  // resolver.ts
  @Mutation((returns) => Boolean)
  potatoReady() {
    pubSub.publish('hotPotatos', { readyPotatoes: 'Your potato love you' });
    // 첫번째는 트리거 지정한 이름, 두번째는 payload 인데 object 형태
    // key 는 메소드 이름 value는 보내고 싶은 데이터
    return true;
  }

  @Subscription((returns) => String)
  readyPotatoes() {
    return pubSub.asyncIterator('hotPotatos');
    // 'hotPotatos' 를 트리거로 지정
  }
  ```

  ```{typescript}
  // 구독
  subscription{
    readyPotatoes
  }

  // 어딘가에서 트리거 발생
  mutation{
    potatoReady
  }

  // 트리거 발생시마다 구독되어 있는 곳에 리턴
  {
    "data": {
      "readyPotatoes": "Your potato love you"
    }
  }
  ```

### Subscription Authentication

- Role, AuthUser 데코레이터 추가

  ```
  // orders.resolver.ts
  @Subscription((returns) => String)
  @Role(['Any'])
  readyPotatoes(@AuthUser() user: User) {
    // 여기선 String을 리턴하지 않고
    // asyncIterator 를 리턴할거다
    return pubSub.asyncIterator('hotPotatos');
    // 'hotPotatos' 를 트리거로 지정
  }
  ```

- 토큰으로 Authentication 하고 싶지만 우리의 jwtMiddleware는 http 로직 안에서만 동작하도록 설계 되어 있다

```{typescript}
// 첫번째로 JwtMiddleware 제거 하자

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
```

- jwtMiddleware 를 삭제하면 문제점이 jwtMiddleware에서 헤더에 있는 토큰으로 DB 검색을 해서 일치하는 유저 정보를 중간에 req에 넣어 주고 있었는데 이게 사라진다

- 두번째 방어선이 guard는 http와 ws 둘 모두에서 동작 되고 에러를 낸다

  - AuthGuard에는 모든 req가 지나간다

  - 첫번째 방어선인 jwtMiddleware 이 사라지고
  - 두번째인 guard

    ```{typescript}
    // auth.guard

    const gqlContext = GqlExecutionContext.create(context).getContext();
    console.log('gql', gqlContext);
    // http 연결시 req 정보 뜨고
    // ws 연결시는 {req: undefined}
    ```

    ```{typescript}
    // app.module

    // jwtMiddleware를 못쓰기 때문에 GraphQL context 에 직접 토큰 넣어주자
    GraphQLModule.forRoot({
      ....
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';
        if (req) {
          return { token: req.headers[TOKEN_KEY] };
          // return { user: req['user'] };
          // ws 랑 같이 쓸때는 jwtMiddleware가 직접 토큰으로 user 찾아서 못 넣어주므로 토큰을 보내자
        } else if (connection) {
          return { token: connection.context[TOKEN_KEY] };
          // connection.context 에 토큰 들어있음
          // context 는 http의 헤더랑 비슷
        }
      },
    }),

    ```

- guard 안에서 jwtMiddleware 에서 하던 로직처리 해야한다

  ```{typescript}
  @Injectable()
  // Guard 를 이용하면 Endpoint 보호 가능
  export class AuthGuard implements CanActivate {
    ...

    constructor(
      private readonly reflector: Reflector,
      private readonly jwtService: JwtService,
      private readonly userService: UsersService, // module에  UsersModule import 필요, Service 쓰려면 export 하는 Module을 추가해야한다
    ) {}

    async canActivate(context: ExecutionContext) {
      const roles = this.reflector.get<AllowedRoles>(
        'allowedRole',
        context.getHandler(),
      ); // 요청 마다 설정된 메타 데이터 읽어오기

      if (!roles) {
        // resolver에 role 메타데이터 설정 안되있으면 해당 req 허가
        // 예 로그인 필요없는 경우의 요청들
        return true;
      }

      const gqlContext = GqlExecutionContext.create(context).getContext();
      const token = gqlContext.token;

      // jwt 인증 로직 추가!
      if (token) {
        const decoded = this.jwtService.verify(token.toString());

        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const { user } = await this.userService.findById(decoded['id']);
          if (!user) {
            // 유저 데이터가 없는 경우 req 거부
            return false;
          }
          if (roles.includes('Any')) {
            // Any 면 모두 허가
            return true;
          }
          return roles.includes(user.role);
        }
      } else {
        return false;
      }

      // 메타 데이터와 user의 role이 일치하는 경우만 true 리턴
    }
  }
  ```

- 다음 문제는 AuthUser 안에서 터지게 된다

  ```{typescript}
  // auth-user.decorator
  export const AuthUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      // http 요청과 gql 형태 달라서 변형;
      const user = gqlContext['user'];
      // 더이상 user 존재 하지 않는다
      return user;
    },
  );
  ```

  ```{typescript}
  // auth.guard
  async canActivate(context: ExecutionContext) {
    ...

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;
    if (token) {
      ...
        gqlContext['user'] = user; // graphql context 안에 user 넣어줘야한다
       ...
    } else {
      return false;
    }
  }
  ```

- 정리
  - JwtMiddleware -> AuthGuard -> 데코레이터 순으로 요청 지나간다

### PubSub

- PubSub은 딱 하나만 존재해야된다
- 공통 모듈로 이동시키기

  ```
  // common.constant
  export const PUB_SUB = 'PUB_SUB';

  // common.module
  @Global()
  @Module({
    exports: [PUB_SUB],
    providers: [
      {
        provide: PUB_SUB,
        useValue: new PubSub(),
      },
    ],
  })

  // order.resolver
  export class OrderResolver {
    constructor(
      ...
      @Inject(PUB_SUB) private readonly pubSub: PubSub,
    ) {} // 추가
  ```

- 유의점
  - PubSub은 오직 서버 하나에서만 동작
  - 서버가 여러개 있으면 별도의 PubSub 서버가 필요함
    - https://www.npmjs.com/package/graphql-redis-subscriptions

### Subscription Filter

- 모든 update에 대응할 필요가 없다
  - 내 주문 정보만 보고싶지 다른 사람 것까지 받고싶지 않다
- 구독자 알림 여부 옵션
- 설정

  ```
  @Mutation((returns) => Boolean)
  async potatoReady(@Args('potatoId') potatoId: number) {
    await this.pubSub.publish('hotPotatos', {
      readyPotatoes: potatoId,
    });
    return true;
  }

  @Subscription((returns) => String, {
    filter: ({ readyPotatoes }, { potatoId }, context) => {
      // payload는 publish 할때 보낸 데이터
      // variables은 subscription 할때 처음 지정한 인자
      // context는 gql context

      // 세개를 활용하면 filter 활용 가능하다
      return readyPotatoes === potatoId;
    },
  })

  @Role(['Any'])
  readyPotatoes(@Args('potatoId') potatoId: number) {
    return this.pubSub.asyncIterator('hotPotatos');
  }
  ```

- potatoId 가 일치할때 만 publish된 데이터 수신

### Subscription Resolve

- 최종적으로 구독자가 받는 response 형태 변경 가능 옵션
- asyncIterator 가 리턴하는 값
- 설정
  ```{typescript}
  @Subscription((returns) => String, {
    ...
    resolve: ({ readyPotatoes }) => {
      return `Your potato with the id ${readyPotatoes}`;
    },
  })
  @Role(['Any'])
  readyPotatoes(@Args('potatoId') potatoId: number) {
    return this.pubSub.asyncIterator('hotPotatos');
  }
  ```

### eager relation

```{typescript}
const order = await this.orders.findOne(orderId, {
        relations: ['restaurant', "customer", "driver"],
      });
```

- order 정보 받아올때 customer restaurants driver relation 이 필요하다

- eager relation은 db에서 entity를 load할때 자동으로 가지고 오는 relation을 의마한다
- lazy relation은 entity의 해당 프로퍼티 직접 접근해야지 비동기로 가지고오는 relation이다
  ```{typescript}
  await order.customer // 이렇게 접근해야 가지고 온다
  ```

```{typescript}
@Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.orders, {
    ...
    eager: true,
  })
  customer?: User;

  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.rides, {
    ...
    eager: true,
  })
  driver?: User;

  @Field((type) => Restaurant, { nullable: true })
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.orders, {
    ...
    eager: true,
  })
  restaurant?: Restaurant;

  @Field((type) => [OrderItem])
  @ManyToMany((type) => OrderItem, { eager: true })
  @JoinTable()
  items: OrderItem[];
```

- 관계를 계속 파고들어가면서 계속 소환하면 db 폭파된다
  - N+1 problem으로 방어할 수 있다

## Payment

- paddle 이용
  - 디지털 상품을 파는데 이용 가능 (멤버쉽, 강의 등)

### Task Scheduling

- https://docs.nestjs.com/techniques/task-scheduling
- 정해진 시간에 function 실행 시켜준다

```
npm install --save @nestjs/schedule
```

- 설정

  ```
  import { Module } from '@nestjs/common';
  import { ScheduleModule } from '@nestjs/schedule';

  @Module({
    imports: [
      ScheduleModule.forRoot()
    ],
  })
  export class AppModule {}
  ```

- Declarative 방법

  - @Cron

    - https://docs.nestjs.com/techniques/task-scheduling#declarative-cron-jobs
    - 지금 시간 기준으로 트리거 작동 시킬때

    ```
    import { Injectable, Logger } from '@nestjs/common';
    import { Cron } from '@nestjs/schedule';

    @Injectable()
    export class TasksService {
      private readonly logger = new Logger(TasksService.name);

      @Cron('45 * * * * *')
      // 1분에 한번, 매번 45초가 되었을때
      handleCron() {
        this.logger.debug('Called when the current second is 45');
      }
    }
    ```

  - @Interval

    - 지정한 초 루틴마다 반복

    ```
    @Interval(15000)
    async checkForPayments2() {
      console.log('checking interval');
    }
    ```

  - @Timeout
    - 지정한 시간후 한 번

- Dynamic 방법

  - https://docs.nestjs.com/techniques/task-scheduling#dynamic-cron-jobs
  - 데코레이터로 형성한 작업을 메서드로 동적으로 변형가능

  ```
  constructor(private schedulerRegistry: SchedulerRegistry) {}
  ...

   @Cron('15 * * * * *', {
    name: 'myTest',
  })
  async checkForPayments() {
    console.log('checking');
    const job = this.schedulerRegistry.getCronJob('myTest');
    job.stop(); // 그만해!
  }
  ```

## 파일 업로드

- https://docs.nestjs.com/techniques/file-upload#file-upload
- nestjs 안에 multer 들어있다

- 전송시 header는 반드시 "Content-Type", multipart/form-data
- body에는 데코레이터에 지정한 이름으로 key를 하고 파일이 선택되어 있어야한다

### 시작

```
// uploads.module
import { UploadsController } from './uploads.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UploadsController],
})
export class UploadsModule {}

// uploads.controller
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('uploads')
export class UploadsController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    console.log(file);
  }
}

```

### AWS 적용해보기

- https://www.npmjs.com/package/aws-sdk

```
npm install aws-sdk
```

- https://console.aws.amazon.com/iam/home?#/users

```
import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';

// AWS import
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'ithavetobeuniqueinamazonworld';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly config: ConfigService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    // 키 등록
    AWS.config.update({
      credentials: {
        accessKeyId: this.config.get<string>('ACCESS_KEY_ID'),
        secretAccessKey: this.config.get<string>('SECRET_ACCESS_KEY'),
      },
    });

    try {
      // 버킷 없을때는 일단 이름정해서 하나 생성해야한다
      // 이름은 AWS 중복된 스토리지가 있으면 안된다
      // 생성하고 나면 코드 제거하고 이름만 기억하면 된다
      //   const upload = await new AWS.S3()
      //     .createBucket({ Bucket: 'ithavetobeuniqueinamazonworld' })
      //     .promise();

      // file
      //   {
      //     fieldname: 'file',
      //     originalname: '60aff68f58929975c3a1197e760d88a2.psd',
      //     encoding: '7bit',
      //     mimetype: 'image/vnd.adobe.photoshop',
      //     buffer: <Buffer 38 42 50 53 00 01 00 00 00 00 00 00 00 03 00 00 02 49 00 00 02 49 00 08 00 03 00 00 00 00 00 00 58 a4 38 42 49 4d 04 04 00 00 00 00 00 07 1c 02 00 00 ... 387957 more bytes>,
      //     size: 388007
      //   }
      const fileName = `${Date.now()}${file.originalname}`;
      const upload = await new AWS.S3()
        .putObject({
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          Key: fileName, // 고유한 이름 필요
          ACL: 'public-read', // public-read 설정 해줘야 누구나 파일 읽는거 가능하다
        })
        .promise(); // promise 꼭해야된다

      const fileURL = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

      return { url: fileURL }; // 프론트 앤드에게 넘길 주소
    } catch (error) {
      return null;
    }
  }
}

```

## CORS 허용

```
// main.ts
app.enableCors();
  // CORS 허용
```
