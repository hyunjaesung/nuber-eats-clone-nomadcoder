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

### Code First 로 graphql 연결

````
GraphQLModule.forRoot({
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
}),
````