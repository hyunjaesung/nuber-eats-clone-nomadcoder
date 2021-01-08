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
