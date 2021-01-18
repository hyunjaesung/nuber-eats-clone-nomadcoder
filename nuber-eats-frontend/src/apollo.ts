import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LOCALSTORAGE_TOKEN } from "./constants";

// ws 연결
// 1번
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(!!token);
export const authTokenVar = makeVar(token);

const wsLink = new WebSocketLink({
  // ws authenticate 해줌
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
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
  link: splitLink, // 3 분기 Link로 변경
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
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
