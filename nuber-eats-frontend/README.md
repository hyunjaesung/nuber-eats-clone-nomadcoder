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

- 대충의 원리
  - useQuery에 grapQL query 문을 넣으면 해당 query에 대해서 옵저버를 생성
  - 리액트 컴포넌트는 Apollo Client 캐시를 통해 query의 결과 값을 구독하게 된다
    - query 문 호출로 api 데이터 를 가지고 온다고 할때
    - apollo 가 호출해서 결과 값을 Apollo Client에 넣고 캐싱하게 되고 그 query를 구독하고 있는 리액트 컴포넌트에 해당 캐싱 값을 넣어주게 된다
  - 캐싱 값만 writeFragment 로 업데이트 하게 되어도 리액트 컴포넌트들 리렌더가 가능하고 refetch로 해당 query 문 호출 다시 해서 해당 query의 캐싱 값 전체 업데이트 해도 리액트 컴포넌트가 리렌더 된다.
  - Apollo Client로 캐싱은 서버 데이터와 상관없는 Local 데이터도 가능하다

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

## USER PAGES

### Verifying Email

- apollo 캐쉬 수정하기 위한 writeFragment 하기

  - https://www.apollographql.com/docs/react/api/cache/InMemoryCache/#writefragment
  - https://www.apollographql.com/docs/react/caching/cache-interaction/#writequery-and-writefragment
  - writeQuery는 추가 할때 writeFragment는 이미 있는것 수정

  ```
  const VERIFY_EMAIL_MUTATION = gql`
    mutation verifyEmail($input: VerifyEmailInput!) {
      verifyEmail(input: $input) {
        ok
        error
      }
    }
  `;

  export const ConfirmEmail = () => {
    const { data: userData } = useMe();
    const client = useApolloClient(); // 아폴로 client 가지고 오기

    const onCompleted = (data: verifyEmail) => {
      const {
        verifyEmail: { ok },
      } = data;

      if (ok && userData?.me.id) {
        // 캐쉬 write 해서 헤더에 있는 verify email 경고 해제

        client.writeFragment({
          // fragment는 type의 일부분 의미, 여기서는 User의 일부분
          id: `User:${userData.me.id}`,
          // 아폴로는 그래프 QL 모델 + 해당 모델의 id 가 있으면 합쳐서 id 만들어서 캐쉬 만든다
          fragment: gql`
            fragment VerifiedUser on User {
              verified
            }
          `, // VerifiedUser 는 내가 알아서 쓰면되고
          // User는 api에서 가지고 오니 맞춰야한다
          // 전체 모델에서 우리가 바꾸고 싶은 일부분
          // 내부에는 우리가 User안에서 뭐를 수정하고 싶은지 쓴다
          data: {
            // send 할 data
            verified: true,
          },
        });
        history.push("/");
      }
    };

    const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
      VERIFY_EMAIL_MUTATION,
      {
        onCompleted,
      }
    );

    useEffect(() => {
      const [_, code] = window.location.href.split("code=");
      verifyEmail({
        variables: {
          input: {
            code,
          },
        },
      });
    }, [verifyEmail]);

    return (
      <div className='mt-52 flex flex-col items-center justify-center'>
        <h2 className='text-lg mb-1 font-medium'>Confirming email...</h2>
        <h4 className='text-gray-700 text-sm'>
          Please wait, don't close this page...
        </h4>
      </div>
    );
  };
  ```

### editProfile 페이지

- 이메일 변경되면 다시 verify 하게 만들어야한다

  - 첫번째 방법은 변경 할 때 그 부분만 writeFragment로 업데이트를 해주는 것
  - 두번째 방법은 useQuery의 refetch 를 써서 query 를 refetch 하는 것
    - 이 함수를 호출하면 query 를 다시 fetch 해준다
    - 캐쉬가 자동으로 업데이트 된다

  ```
  // editProfile.tsx

  const { data: userData, refetch } = useMe();
  const client = useApolloClient();

  const onCompleted = async (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      // update the cache
      // 첫번째 방법
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();

      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }

      // 두번째 방법

      // await refetch();
      // editProfile 후 변경된 me query문 다시 호출
      // 캐싱된 데이터 전부 바뀌고 헤더에 다시 경고문 뜨게 된다
      // useMe 될 때마다 me query 문 호출 하게 되고 이 데이터로 뭔가 그리는데
      // 두번째 방법은 한번 더 호출
      // 더 느린 경우가 당연히 많다
    }
  };

  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });
  ```

## Restaurant

- 쿼리문 여러개 도 호출 가능하구나
  ```
  const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
  `;
  ```
- query문 변수로 넣기

  ```
  const RESTAURANT_FRAGMENT = gql`
    fragment RestaurantParts on Restaurant {
      id
      name
      coverImg
      category {
        name
      }
      address
      isPromoted
    }
  `;

  const RESTAURANTS_QUERY = gql`
    query restaurantsPageQuery($input: RestaurantsInput!) {
      allCategories {
        ok
        error
        categories {
          id
          name
          coverImg
          slug
          restaurantCount
        }
      }
      restaurants(input: $input) {
        ok
        error
        totalPages
        totalResults
        results {
          # id
          # name
          # coverImg
          # category {
          #   name
          # }
          # address
          # isPromoted
          # 아래와 같이 단축 가능
          ...RestaurantParts
        }
      }
    }
    ${RESTAURANT_FRAGMENT}
  `;
  ```

### Pagination

```
import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Restaurant } from "../../components/restaurant";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Restaurants = () => {
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  return (
        ...
          <div className='grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10'>
            {page > 1 ? (
              <button
                onClick={onPrevPageClick}
                className='focus:outline-none font-medium text-2xl'>
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span>
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button
                onClick={onNextPageClick}
                className='focus:outline-none font-medium text-2xl'>
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


```

### Search

- useLazyQuery

  - useQuery는 컴포넌트가 mount, render될 때 apollo client가 자동으로 실행한다.
  - useLazyQuery component가 render될 때가 아니라 어떤 이벤트에 대해 쿼리를 실행하게 해준다.
  - 조건이 달성 했을때 Query 문 호출 하고 싶을때
  - https://www.apollographql.com/docs/react/api/react/hooks/#uselazyquery

  ```
  const SEARCH_RESTAURANT = gql`
    query searchRestaurant($input: SearchRestaurantInput!) {
      searchRestaurant(input: $input) {
        ok
        error
        totalPages
        totalResults
        restaurants {
          ...RestaurantParts
        }
      }
    }
    ${RESTAURANT_FRAGMENT}
  `;

  export const Search = () => {
    const location = useLocation();
    const history = useHistory();
    const [callQuery, { loading, data, called }] = useLazyQuery<
      searchRestaurant,
      searchRestaurantVariables
    >(SEARCH_RESTAURANT);
    // 조건이 달성 했을때 Query 문 호출 하고 싶을때 useLazyQuery 이용
    // useQuery 는 선언과 동시에 바로 호출인 반면 useLazyQuery는 리턴된 함수를 호출해야 호출된다

    useEffect(() => {
      const [_, query] = location.search.split("?term=");
      if (!query) {
        return history.replace("/");
      }
      callQuery({
        variables: {
          input: {
            page: 1,
            query,
          },
        },
      });
    }, [history, location]);
  ```

## UNIT TESTING REACT COMPONENTS

- jest
- testing-library
  - https://testing-library.com/docs/react-testing-library/intro/
  - 우리가 테스트할 건 코드가 아니라 유저들이 보는 output
    - 그렇기에 100% coverage가 안될수 도 있음

### coverage 대상 설정

- https://jestjs.io/docs/en/configuration
- collectCoverageFrom : coverage에 포함하고 픈 파일 패턴

  ```
  npm test -- --coverage --watchAll=false

  --verbose 옵션 넣으면 it 뒤에 붙은 문자열이랑 같이 ㄴ뜬다
  ```

  ```
  // package.json
  "jest":{
    "collectCoverageFrom": [
      "./src/App.tsx",
      "./src/components/**/*.tsx",
      "./src/pages/**/*.tsx",
      "./src/router/**/*.tsx"
    ]
  }
  ```

### test에 포함되기 위한 조건

- https://create-react-app.dev/docs/running-tests/
- Files with .js suffix in \_ _ tests _ \_ folders.
- Files with .test.js suffix.
- Files with .spec.js suffix.

### testing-library render option

- https://testing-library.com/docs/react-testing-library/api#render-options

### render getByText mock 써보기

```
import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

jest.mock("./router/loggedOutRouter", () => {
  return {
    LoggedOutRouter: () => <span>LoggedOut</span>,
  };
}); // 경로 쓰고 컴포넌트 mock으로 바꿔치기

describe("<App/>", () => {
  it("render loggedOutRouter 테스트", () => {
    // render 안에 리액트 컴포넌트 구문 에러나는 문제
    // 파일이름을 tsx 로 바꾸면된다

    render(<App />); // 앱을 render하면서 에러 test해본다
    // App 만 바로 테스트하니까 깊이 들어가면서 아폴로 client가 없다고 에러가 난다
    // 우리가 알고싶은거는 단순히 App까지 렌더 분기가 잘되는지
    // mock을 해보자

    // render 함수는 많은 함수를 return 한다
    const { debug, getByText } = render(<App />);
    debug(); // 그려지는 html console.log
    getByText("LoggedOut"); // 해당 텍스트 있으면 통과
  });
});
```

```
import React from "react";
import { render, waitFor } from "@testing-library/react";
import App from "./App";
import { isLoggedInVar } from "./apollo";

jest.mock("./router/loggedInRouter", () => {
  return {
    LoggedInRouter: () => <span>LoggedIn</span>,
  };
});

describe("<App/>", () => {
  it("render loggedInRouter 테스트", async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      // state 업데이트 끝날때 까지 기다려주게 한다
      // 안쓰면 act 어쩌고 에러남
      isLoggedInVar(true);
      // reactive variable 을 조건문 통과를 위해 그냥 바꿔버린다
    });
    getByText("LoggedIn");
  });
});
```

### rerender, container, expect 써보기

```
import { render } from "@testing-library/react";
import React from "react";
import { Button } from "../button";

describe("<Button />", () => {
  it("props 와 render 테스트", () => {
    const { debug, getByText, rerender } = render(
      <Button canClick={true} loading={false} actionText={"test"} />
    );
    getByText("test");

    // rerender 써서 하는 방법

    // rerender(<Button canClick={true} loading={true} actionText={"test"} />);
    // // 반복해서 조건 바꿔서 render 새로 해보고싶을때
    // getByText("Loading...");
  });

  it("should display loading", () => {
    const { getByText } = render(
      <Button canClick={true} loading={true} actionText={"test"} />
    );
    getByText("Loading...");
  });

  it("should display canClick", () => {
    const { getByText, container, debug } = render(
      <Button canClick={false} loading={true} actionText={"test"} />
    );
    getByText("Loading...");

    // container는 맨 바깥쪽 있는 div
    expect(container.firstChild).toHaveClass("pointer-events-none");
    // expect 써서 클래스 테스트
  });
});
```

### html attribute 테스트

```
import { render } from "@testing-library/react";
import React from "react";
import { Restaurant } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Restaurant/>", () => {
  it("renders Ok with props", () => {
    const props = {
      id: "1",
      coverImg: "x",
      name: "nameTest",
      categoryName: "catTest",
    };
    const { debug, getByText, container } = render(
      <Router>
        <Restaurant {...props} />
      </Router>
    );
    // Link가 Router 밖에 쓰일 수 없다고 에러가 난다
    // test를 위한 Router를 import

    debug();
    getByText(props.name);
    getByText(props.categoryName);

    // html attribute 체크
    expect(container.firstChild).toHaveAttribute(
      "href",
      `/restaurants/${props.id}`
    );
  });
});

```

### apollo 로직 있을 경우 테스트 1

- MockedProvider, queryByText

  - https://www.apollographql.com/docs/react/development-testing/testing/#the-mockedprovider-component

  ```
  import { render, waitFor } from "@testing-library/react";
  import React from "react";
  import { MockedProvider } from "@apollo/client/testing";
  import { Header } from "../header";
  import { BrowserRouter as Router } from "react-router-dom";
  import { ME_QUERY } from "../../hooks/useMe";

  describe("<Header/>", () => {
    it("renders verify banner", async () => {
      // Header 안에 graphql 아폴로 쿼리 호출 로직이 있어서 에러
      // 아폴로가 제공하는 테스트 툴 MockedProvider 사용

      // Header 안에 query data로 분기 치는 로직이 있다 -> mock 이 필요하다
      // useMe를 mock 하는게 아니라
      // MockedProvider으로 query 의 request를 만들고 result까지 mock 가능하다

      await waitFor(async () => {
        const { getByText } = render(
          <MockedProvider
            mocks={[
              {
                request: {
                  query: ME_QUERY,
                },
                result: {
                  data: {
                    me: {
                      id: 1,
                      email: "",
                      role: "",
                      verified: false,
                    },
                  },
                },
              },
            ]}>
            <Router>
              <Header />
            </Router>
          </MockedProvider>
        );
        await new Promise((resolve) => setTimeout(resolve, 0));
        getByText("Please verify your email.");
        // mock으로 만든 query 문 동작이 비동기라서 잠깐 대기 필요
      }); // state 변경 시키는게 있어서 waitFor 사용
    });

    it("renders without verify banner", async () => {
      await waitFor(async () => {
        const { queryByText } = render(
          <MockedProvider
            mocks={[
                      ...
                      verified: true,
                    },
                  },
                },
              },
            ]}>
            <Router>
              <Header />
            </Router>
          </MockedProvider>
        );

        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(queryByText("Please verify your email.")).toBe(null);

        // 해당 문구가 없어야 통과 하는 테스트
        // queryByText 는
        // 해당 문구가 있으면 해당 문구가 있는 tag를 반환하고
        // 해당 문구가 없으면 null 을 반환한다
      });
    });
  });

  ```

### document.title 테스트

- vanilla js나 dom 스펙도 다 테스팅 가능

```
describe("<NotFound />", () => {
  it("renders OK", async () => {
    render(
      <HelmetProvider>
        <Router>
          <NotFound />
        </Router>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(document.title).toBe("Not Found | Nuber Eats");
    }); // helmet이 바로 안바꿔줌
  });
});
```

### apollo 로직 있을 경우 테스트 2

- mockedProvider의 케이스 보다 좀 더 복잡하게 테스트 하고싶다

  - mockedProvider는 단순히 request 와 result만 mock 하는 정도

- mock apollo client 사용

  - https://www.npmjs.com/package/mock-apollo-client
  - 더 많은 control을 제공하는 모듈
  - jest 에서 제공하는 것들을 더 유용하게 활용 가능
  - npm i mock-apollo-client

- testing library user-event

  - https://testing-library.com/docs/ecosystem-user-event/
  - 인풋 제어 필요 한 경우

  ```
  // login.spec.tsx

  import { ApolloProvider } from "@apollo/client";
  import { render, RenderResult, waitFor } from "@testing-library/react";
  import { createMockClient, MockApolloClient } from "mock-apollo-client";
  import React from "react";
  import { HelmetProvider } from "react-helmet-async";
  import { Login } from "../login";
  import { BrowserRouter as Router } from "react-router-dom";
  import userEvent from "@testing-library/user-event";
  import { LOGIN_MUTATION } from "../login";

  // 코드에서 생기는 일이 아닌
  // 유저한테 생기는 일( 유저가 확인하는 html )을 테스트 해야한다

  describe("<Login/>", () => {
    let renderResult: RenderResult;
    let mockedClient: MockApolloClient;

    beforeEach(async () => {
      // Mock 데이터를 넣은 Login 컴포넌트 생성
      await waitFor(() => {
        mockedClient = createMockClient();
        renderResult = render(
          // 진짜 ApolloProvider안에 mock client 넣기
          <ApolloProvider client={mockedClient}>
            <Router>
              <HelmetProvider>
                <Login />
              </HelmetProvider>
            </Router>
          </ApolloProvider>
        );
      });
    });

    ...

    it("submit form and calls mutation", async () => {
      const formData = {
        email: "real@test.com",
        password: "123",
      };

      const { getByPlaceholderText, getByRole, debug } = renderResult;
      const email = getByPlaceholderText(/email/i); // email input 창 찾기
      const password = getByPlaceholderText(/password/i); // password input 창 찾기
      const submitBtn = getByRole("button"); // tag에 role넣어서 button 찾기

      const mockedMutationResponse = jest.fn().mockResolvedValue({
        data: {
          login: {
            ok: true,
            token: "asdfafd",
            error: null,
          },
        },
      });

      // 첫번째 인자에는 실제 GraphQL문 사용
      // 해당 GraphQL문이 호출 되었을때 호출되고 결과 return하는 콜백 함수가 두번째 인자
      mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
      // 해당 Mutation 을 구독 하고 있기 때문에 호출 되면 그냥 response 정해진 걸로 해주면 된다

      await waitFor(() => {
        userEvent.type(email, formData.email);
        userEvent.type(password, formData.password);
        userEvent.click(submitBtn);
      });

      // 두번째 인자 콜백 함수로 여러가지 검증
      expect(mockedMutationResponse).toBeCalledTimes(1); // 호출 제대로 됐는지
      expect(mockedMutationResponse).toBeCalledWith({
        // 인자는 제대로 들어갔는지
        loginInput: {
          ...formData,
        },
      });
    });
  });

  ```

### tag에 role 넣어서 테스트

```
// login.spec.tsx
....

it("display email validation error", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResult;

    const email = getByPlaceholderText(/email/i); // email input 창 찾기

    await waitFor(() => {
      userEvent.type(email, "this@fail"); // 유저가 하는 이벤트를 넣어줄수 있음
    });

    let errorMessage = getByRole("alert"); // tag에 role추가 하고 찾아오기
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
    // 에러 메시지 테스트

    await waitFor(() => {
      userEvent.clear(email); // 다지우기
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });

...
```

### localStorage 테스트

```
it("submit form and calls mutation", async () => {
    ...

    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    jest.spyOn(Storage.prototype, "setItem");

    // 이 사이에 Storage.prototype 의 setItem 메서드가 쓰여야 spying 된다

    expect(localStorage.setItem).toHaveBeenCalledWith("nuber-token", "asdfafd");

  });
```

### 반복되는 Provider 컴포넌트 래핑을 custom render로 바꿔보자

- https://testing-library.com/docs/react-testing-library/setup#custom-render

```
// testUtil.tsx
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";

// Provider로 감싸주기
const AllTheProviders: React.FC = ({ children }) => {
  return (
    <HelmetProvider>
      <Router>{children}</Router>
    </HelmetProvider>
  );
};

const customRender = (ui: ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render }; // 엎어치기
```

```
import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import { CreateAccount } from "../createAccount";
import { render, waitFor, RenderResult } from "../../testUtils";
// @testing-library/react 엎어 치기한거라 다 가지고 올수 있다

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });
  it("renders OK", async () => {
    await waitFor(() =>
      expect(document.title).toBe("Create Account | Nuber Eats")
    );
  });
});

```

### import 한 라이브러리 mock 도와주는 package이 없을 때

- library를 mock 해야한다
- 웬만하면 mock 하지말고 testing package가 있으면 쓰면 좋다

```
const mockPush = jest.fn();
// 변수이름을 mock으로 시작해야 jest 바깥 선언 가능하다

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  // 그냥 쓰면 통으로 갈아버려서 기존에 react-router-dom에서 가져온 함수들도 다 사라진다
  // requireActual 쓰자
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

...

  expect(mockPush).toHaveBeenCalledWith("/");

...
```

## E2E Test

### cypress

```
npm install cypress @testing-library/cypress
```

```
npx cypress open
```

- cypress 폴더가 생기는데 integration 폴더에 넣고 소프트웨어 integration 버튼 누르면 테스트 시작한다
- cypress.json
  ```
  {
    "baseUrl":"http://localhost:3000"
  }
  ```
- tsconfig
  ```
  // cypress/tsconfig.json
  // cypress ts 설정
  {
      "compilerOptions": {
          "allowJs": true,
          "baseUrl": "../node_modules",
          "types":[
              "cypress",
              "@testing-library/cypress"
          ],
          "outDir": "#"
      },
      "include": [
          "./**/*.*"
      ]
  }
  ```

### 시작

```
// integration/firstTest.ts
describe("First Test", () => {
  it("should go to home page", () => {
    cy.visit("/")
      .title()
      .should("eq", "Login | Nuber Eats");
  });

  it("can fill out the form", () => {
    // 소프트웨어 가서 좌측 상단 표식 모양 누르면 원하는 태그 알수있다
    cy.visit("/")
      .get('[name="email"]')
      .type("test2@test.com")
      .get('[name="password"]')
      .type("123")
      .get(".text-lg")
      .should("not.have.class", "pointer-events-none");
    // to do can login
  });
});

```

- 리액트 페이지 실행
- npx cypress open
- 소프트웨어에 있는 run 클릭 하면 확인가능

- it 들은 다 분리된 테스트

### Cypress Testing Library 사용하기

- https://testing-library.com/docs/cypress-testing-library/intro/

- support/commands 에 추가
  ```
  import "@testing-library/cypress/add-commands";
  ```
- testing library 이용

  ```
  describe("Log In", () => {
    const user = cy;

    it("can see email password validation errors", () => {
      // testing library 를 이용한 방법
      // testing lobrary 메서드 쓸때마다 cy 분리 해야한다
      user.visit("/");
      user.findByPlaceholderText(/email/i).type("notEmailsdffiof");
      user.findByRole("alert").should("have.text", "Please enter a valid email");

      user.findByPlaceholderText(/email/i).clear();
      user.findByRole("alert").should("have.text", "Email is required");

      user.findByPlaceholderText(/email/i).type("email@email.com");
      user
        .findByPlaceholderText(/password/i)
        .type("a")
        .clear()
        .click();
      user.findByRole("alert").should("have.text", "Password is required");
    });
  ```

### cypress command

- https://docs.cypress.io/api/commands/and.html

- window localStorage 접근
  ```
    user.window().its("localStorage.nuber-token").should("be.a", "string");
  ```

### cypress 이용해서 request 갈아 끼우기

- cy.intercept() 사용하면 된다
- https://docs.cypress.io/api/commands/intercept.html#Comparison-to-cy-route

```
it("should be able to create account and login", () => {
    cy.intercept("http://localhost:4000/graphql", (req) => {
      req.reply((res) => {
        const { operationName } = req.body;

        // 모든 해당 도메인 response를 바꾸고 싶지 않으면 조건 걸어줘야한다
        // 안걸면 밑에 로그인도 이걸로 가서 token 안온다
        if (operationName && operationName === "createAccountMutation") {
          res.send({
            // 네트워크 탭에서 res 복붙해와서 원하는대로 바꿈
            data: {
              createAccount: {
                ok: true,
                error: null,
                __typename: "CreateAccountOutput",
              },
            },
          });
        }
      });
    });
    // 실제 있어도 존재 하지 않는 척으로 가짜로 만듦
    // 아래 테스트로 하면 있는 계정이라 원래 ok false 와야한다

    cy.visit("/create-account");
    cy.findByPlaceholderText(/email/i).type("test@test.com");
    cy.findByPlaceholderText(/password/i).type("123");
    cy.findByRole("button").click();
    cy.wait(1000);
    cy.findByPlaceholderText(/email/i).type("test@test.com");
    cy.findByPlaceholderText(/password/i).type("123");
    cy.findByRole("button").click();
    cy.title().should("eq", "Login | Nuber Eats");
    cy.window().its("localStorage.nuber-token").should("be.a", "string");
  });
```

- response 데이터 json으로 가지고오기

  ```
  // cypress/fixtures/auth/create-account.json

  {
  "data": {
      "createAccount": {
        "ok": true,
        "error": null,
        "__typename": "CreateAccountOutput"
      }
    }
  }
  ```

  ```
  // cypress/integration/auth/create-account.ts

  it("should be able to create account and login", () => {
    cy.intercept("http://localhost:4000/graphql", (req) => {
      req.reply((res) => {
        const { operationName } = req.body;

        if (operationName && operationName === "createAccountMutation") {
          res.send({
            // data: {
            //   createAccount: {
            //     ok: true,
            //     error: null,
            //     __typename: "CreateAccountOutput",
            //   },
            // },
            fixture: "auth/createAccount.json",
          });
        }
      });
    });
  ```

### custom command 만들기

```
// 계속 반복해서 쓰는 이 코드 command로 만들고 싶다
cy.window().its("localStorage.nuber-token").should("be.a", "string");

// support/commands.js
Cypress.Commands.add("assertLoggedIn", ()=> {
    cy.window().its("localStorage.nuber-token").should("be.a", "string");
})

// createAccount.ts
...
cy.findByRole("button").click();
cy.title().should("eq", "Login | Nuber Eats");
// 이런식으로 교체
cy.assertLoggedIn();
```

```
// 여러 다른 예

Cypress.Commands.add("assertLoggedOut", () => {
  cy.window().its("localStorage.nuber-token").should("be.undefined");
});

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/");
  // @ts-ignore
  cy.assertLoggedOut();
  cy.title().should("eq", "Login | Nuber Eats");
  cy.findByPlaceholderText(/email/i).type(email);
  cy.findByPlaceholderText(/password/i).type(password);
  cy.findByRole("button")
    .should("not.have.class", "pointer-events-none")
    .click();
  // @ts-ignore
  cy.assertLoggedIn();
});
```

## Restaurant

### File Upload

```
const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0]; // file은 사실 List

      // file만 따로 빼서 붙여줌
      const formBody = new FormData();
      formBody.append("file", actualFile);

      // graphql이 아니라 http 로 전송
      const { url: coverImg } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();

      // 파일은 주소만 따로 받아서 string으로 mutation보냄
      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImg,
          },
        },
      });
    } catch (e) {}
  };

```

## Order 리얼타임 주문 설계

### Subscription

- https://www.apollographql.com/docs/react/data/subscriptions/

```
npm install subscriptions-transport-ws
```

### Subscription 설정

```

import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(!!token);
export const authTokenVar = makeVar(token);

// 1번 ws링크 만들기
const wsLink = new WebSocketLink({
  // ws authenticate 해줌
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      // http header가 아닌 ws context에 들어갈것
      "x-jwt": authTokenVar(),
    },
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "",
    },
  };
}); // Client의 모든 req의 context 변경

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

// 2번 splitLink 만들기
// return true면 wsLink false면 httpLink

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
      // subscription 이 operation이면 true
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink, // 3번 splitLink로 변경
  // 백엔드 주소
  cache: new InMemoryCache({
    ....
```

### 사용

- useSubscription

  - https://www.apollographql.com/docs/react/data/subscriptions/#executing-a-subscription

  ```
  const FULL_ORDER_FRAGMENT = gql`
    fragment FullOrderParts on Order {
      id
      status
      total
      driver {
        email
      }
      customer {
        email
      }
      restaurant {
        name
      }
    }
  `;

  const ORDER_SUBSCRIPTION = gql`
    subscription orderUpdates($input: OrderUpdatesInput!) {
      orderUpdates(input: $input) {
        ...FullOrderParts
      }
    }
    ${FULL_ORDER_FRAGMENT}
  `;

  export const Order = () => {
    ...
    const { data: subData } = useSubscription<
      orderUpdates,
      orderUpdatesVariables
    >(ORDER_SUBSCRIPTION, {
      variables: {
        input: {
          id: +params.id,
        },
      },
    }); // 상태 변화하면 data 온다

    return (
      <div className='mt-32 container flex justify-center'>
        <Helmet>
          <title>Order #{params.id} | N
  ```

- subscribeToMore

  - useQuery의 데이터와 useSubscription의 데이터가 결국 같은 목적을 가져와서 데이터를 보여주기 때문에 같은 state로 엮어서 써도 되긴하지만 더 쉽게 해줌

  ```
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
      GET_ORDER,
      {
        variables: {
          input: {
            id: +params.id,
          },
        },
      }
    );

  const { data: subData } = useSubscription<
    orderUpdates,
    orderUpdatesVariables
  >(ORDER_SUBSCRIPTION, {
    variables: {
      input: {
        id: +params.id,
      },
    },
  });

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION, // 쿼리문
        variables: { // subscription 인풋
          input: {
            id: +params.id,
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: orderUpdates } }
        ) => {
          if (!data) return prev;
          return {
            // 같은 구조로 return 필요
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
        // 이전의 query data와 새로운 subscription data가 필요
      });
    }
  }, [data]);


  ```
