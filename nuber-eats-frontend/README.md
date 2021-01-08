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

export const LoggedOutRouter = () => {
  const { register, watch, handleSubmit, errors } = useForm();
  const onSubmit = () => {
    console.log(watch());
    // watch 쓰면 submit 된 object 반환해준다
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
