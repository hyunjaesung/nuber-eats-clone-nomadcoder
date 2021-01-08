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
