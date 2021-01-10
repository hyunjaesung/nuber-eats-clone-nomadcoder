# nuber-eats-frontend

## Init 설정

### 리액트

    ```
    npx create-react-app nuber-eats-frontend --template=typescript
    ```

- typescript jsx 빨간줄 뜨면 오른쪽 아래에서 typescript 버전 workspace 버전으로 변경해 줄 수 있다

### Tailwind Css

- https://tailwindcss.com/
- https://tailwindcss.com/docs/installation

  ```
  npm install tailwindcss postcss autoprefixer
  ```

- Tailwind CSS IntelliSense 익스탠션도 다운
- Tailwind은 여러 클래스를 캡슐화 하는 기능도 있다
- 지원하는 클래스외에 커스텀 class도 만들 수 있다

- TailwindCss 확장을 위한 준비

  - postcss 활용을 위해 postcss도 설치

    - config 파일 만들기
      - postcss.config.js
        - tailwind css로 빌드 하기 위한 설정
      - tailwind.config.js
        - tailwind 확장 위한 설정
        ```
        npx tailwindcss init
        ```

  - autoprefixer 는 브라우저 호환성 하도록 접두어 추가해준다 -moz- 같은 접두어

  - tailwind 용 css 파일 만들어야 한다

    ```
    // tailwind.css

    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

  - 이 파일을 빌드하면 이용가능한 css 파일을 만들어준다

    ```
    // package.json

    "tailwind:build": "tailwind build ./src/styles/tailwind.css -o ./src/styles/styles.css",

    ```

    - styles.css에 모든 tailwind 마크업이 들어가있어서 엄청 큰데 나중에 production 모드로 빌드하면 안 쓰는건 사라진다
    - styles.css import 해서 쓰면된다

- 주요 class

  - h- : 높이, screen 하면 100vh
  - px py pt pb ... : padding x y top bottom 수치
  - mx my mt mb ... : padding x y top bottom 수치
  - bg- : background 색
  - w- : width
  - max-w- : max width
  - rounded : 모서리 라운드 처리
  - flex-col : flex column 처리
  - shadow : shadow 처리
  - hover, focus : state 처리 바로 가능
  - border- : tailwind는 세심해서 다 따로 설정 필요 border-green-600 같은 경우는 딱 border color만 설정 border 같은거 써줘서 width 적용 되도록 해야함

- 커스텀 클래스

  - 빌드시 만들어 넣어서 빌드시켜준다

  ```
  @tailwind base;
  @tailwind components;

  /* 커스텀 스타일 */
  .input {
    @apply bg-gray-100 shadow-inner focus:ring-2  focus:ring-green-600 focus:ring-opacity-90 focus:outline-none py-3 px-5 rounded-lg;
  }

  .btn {
    @apply py-3 px-5 bg-gray-800 text-white  text-lg rounded-lg focus:outline-none hover:opacity-90;
  }

  @tailwind utilities;

  ```

  ```
  // jsx 안에 이렇게 넣으면 먹는다
  <input
    ...
    className="input"
  />
  ```

### Apollo

- https://www.apollographql.com/docs/react/get-started/

```
npm install @apollo/client graphql
```

```
import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  // 백엔드 주소
  cache: new InMemoryCache()
});
```

- tsx prettier 안먹을때
  ```
  "editor.formatOnSave": true,
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
    },
    "[typescriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
  ```

## #15 AUTHENTICATION

### Local-only fields

- https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/#gatsby-focus-wrapper
- 아폴로의 캐싱 기능
- 클라이언트 에서만 쓰는 데이터를 아폴로 서버에 따로 저장 -> 서버에 보내는거 아님 유의, 서버에 보낼 graphql문은 query 문 작성 필요
- 아폴로가 서버와 달리 local state 를 가지게되어 많은 정보를 전역적으로 활용 가능하다 -> 리덕스 대체

- 설정

  ```
  // apollo.ts

  export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  // 백엔드 주소
  cache: new InMemoryCache({
    typePolicies:{
      Query:{
        fields:{
          isLoggedIn:{
            read() { // field 값을 반환하는 함수
              // 로직
              return false;
            }
          }
        }
      }
    }
  })
  });
  ```

  ```
  // App.tsx
  import * as React from "react";
  import { LoggedOutRouter } from "./router/loggedOutRouter";
  import { gql, useQuery } from '@apollo/client'

  const IS_LOGGED_IN = gql`
    query isLoggedIn {
      isLoggedIn @client
    }
  `;
  // isLoggedIn @client isLoggedIn만
  // apollo 필드 설정한거랑 똑같으면 된다

  function App() {
    const { data } = useQuery(IS_LOGGED_IN);
    console.log(data);
    // {isLoggedIn: false} 브라우저 콘솔에서 확인가능
    return (
      <LoggedOutRouter />
    );
  }

  export default App;
  ```

  ```
  // 수정 원할시
  const cache = new InMemoryCache();

  const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache
  });

  cache.writeQuery({ // query 수정
    query: IS_LOGGED_IN,
    data: {
      isLoggedIn: !!localStorage.getItem("token"),
    },
  });
  ```

- reactive variable 방법

  - https://www.apollographql.com/docs/react/local-state/reactive-variables/
  - 생성

    ```
    import { makeVar } from '@apollo/client';

    const cartItemsVar = makeVar([]);
    ```

    - 위의 gql 방법 안쓰고도 전역적으로 참조가능한 변수 생성 가능
      - 저 변수 수정하면 모든 graphql 데이터 자동으로 업데이트 된다
    - reactive variable 설정

      ```
      // apollo.ts

      import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

      export const isLoggedInVar = makeVar(false);

      export const client = new ApolloClient({
        uri: "http://localhost:4000/graphql",
        // 백엔드 주소
        cache: new InMemoryCache({
          typePolicies: {
            Query: {
              fields: {
                isLoggedIn: {
                  read() {
                    // field 값을 반환하는 함수
                    // 로직
                    return isLoggedInVar();
                  },
                },
              },
            },
          },
        }),
      });

      // loggedOutRouter
      import React from "react";
      import { isLoggedInVar } from "../apollo";
      export const LoggedOutRouter = () => {
        const onClick = () => {
          isLoggedInVar(true); // 이렇게 만 해주면 된다
        };
        return (
          <div>
            <h1>loggedout</h1>
            <button onClick={onClick}>click to Login</button>
          </div>
        );
      };
      ```

      ```
      // App.tsx
      import * as React from "react";
      import { LoggedOutRouter } from "./router/loggedOutRouter";
      import { gql, useQuery, useReactiveVar } from "@apollo/client";
      import { LoggedInRouter } from "./router/loggedInRouter";
      import { isLoggedInVar } from "./apollo";

      function App() {
        const isLoggedIn = useReactiveVar(isLoggedInVar); // gql 안쓰고 가져다 쓸 수 있다

        return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
      }

      export default App;
      ```

### React Hook Form

- https://react-hook-form.com/api
- 쉽게 Form 만들어서 검증까지 가능하게 도와주는 모듈

```
npm install react-hook-form
```

```
import React from "react";
import { useForm } from "react-hook-form";
import { isLoggedInVar } from "../apollo";

interface IForm {
  email: string;
  password: string;
}

export const LoggedOutRouter = () => {
  const { register, watch, handleSubmit, errors } = useForm<IForm>();
  // watch 쓰면 submit 된 object 반환해준다
  // errors 에는 어떤 부분이 틀렸는지 반환해준다
  const onSubmit = () => {
    console.log(watch());
  };
  const onInvalid = () => {
    console.log("cant create account");
  };
  console.log(errors);
  return (
    <div>
      <h1>Logged Out</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            ref={register({
              required: "This is required",
              pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
            })}
            name="email"
            type="email"
            placeholder="email"
          />
          {/* 에러 활용해서 경고 메시지 띄우기 부분 */}
          {errors.email?.message && (
            <span className="font-bold text-red-600">
              {errors.email?.message}
            </span>
          )}
          {errors.email?.type === "pattern" && (
            <span className="font-bold text-red-600">Only gmail allowed</span>
          )}
        </div>
        <div>
          <input
            ref={register({ required: true })}
            name="password"
            type="password"
            required
            placeholder="password"
          />
        </div>
        <button className="bg-yellow-300 text-white">Submit</button>
      </form>
    </div>
  );
};
```

- form 안에 button 태그가 있으면 default 로 type="submit" 상태이다 type="button" 으로 적어주면 submit 동작안한다

### Mutation

- 쿼리문 선언
  ```
  const LOGIN_MUTATION = gql`
    mutation PotatoMutation($email: String!, $password: String!) {
      login(input: { email: $email, password: $password }) {
        ok
        token
        error
      }
    }
  `; // mutation 뒤에 붙은 이름과 변수 선언은 오직 프론트앤드를 위한것
  // $를 붙이면 apollo가 변수라고 확인
  ```
- hook
  ````
  const [loginMutation, { loading, error, data }] = useMutation(LOGIN_MUTATION);
  // loginMutation은 트리거 함수, data는 mutation으로 반환되는 데이터
  ```
  ````

### Apollo Tooling

- https://github.com/apollographql/apollo-tooling
- Apollo Tooling를 이용해서 DTO가 스키마가 되고 프론트앤드를 위한 type 정보를 얻고 type 으로 어떤 정보를 backend로 보내고 어떤 정보를 받아올지 확신 가능
- apollo.config.js

  - https://www.apollographql.com/docs/devtools/apollo-config/

- codegen 이용해서 생성하고 mutation 에 타입적용하자

  ```
  // apollo.config.js

  module.exports = {
    client: {
      includes: ["./src/**/*.tsx"],
      tagName: "gql",
      service: {
        name: "nuber-eats-backend",
        url: "http://localhost:4000/graphql",
      },
    },
  };

  ```

  ```
  npx apollo client:codegen src/__generated__ --target=typescript --outputFlat
  ```

  ```
  const [loginMutation, { loading, error, data }] = useMutation<PotatoMutation, PotatoMutationVariables>(
    LOGIN_MUTATION
  );

  // 이렇게 활용 가능
  ```

- grapql 스키마 를 타입스크립트 타입으로
  ```
  // DTO를 이용한 grapql 스키마를 프론트 타입으로 쓸 수 있다
  // 이렇게 스키마 타입을 쓰고 codegen을 하면 globalType으로 넣어준다
  // 서버에서 DTO를 수정하면 바로 타입 에러가 나고 버그 찾을 수 있다
  const LOGIN_MUTATION = gql`
    mutation loginMutation($loginInput: LoginInput!) {
      login(input: $loginInput) {
        ok
        token
        error
      }
    }
  `;
  ```

### useMutation

```
 const [loginMutation, { loading, error, data }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    // update
    // A function used to update the cache after a mutation occurs
    // 첫번째 인자로 캐쉬 인스턴스 두번째 인자로 data 가 들어간다
    // onError
    // 에러시에 동작하는 콜백
    onCompleted: onCompleted,
    // 완료시에 동작하는 콜백, argument로 data 들어간다
  });
```

### 토큰 헤더에 넣어서 보내기

- https://www.apollographql.com/docs/link/links/http/#gatsby-focus-wrapper
- https://www.apollographql.com/docs/react/networking/authentication/

```
// apollo.tsx

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const authTokenVar = makeVar(token);

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "",
    },
  };
}); // Client의 모든 req의 context 변경

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  // 백엔드 주소
  ....
  }),
});

```

```
// login.tsx

 const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted: onCompleted,
    // 완료시에 동작하는 콜백, argument로 data 들어간다
  });
  // loginMutation은 트리거 함수, data는 mutation으로 반환되는 데이터
```

```
// LoggedInRouter.tsx

import { gql, useQuery } from "@apollo/client";
import React from "react";
import { isLoggedInVar } from "../apollo";

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery(ME_QUERY);
  if (!data || loading || error) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <span className='font-medium text-xl tracking-wide'>Loading...</span>
      </div>
    );
  }
  return (
    <div>
      <h1>{data.me.email}</h1>
    </div>
  );
};

```
