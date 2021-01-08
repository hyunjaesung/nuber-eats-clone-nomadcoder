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
