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
