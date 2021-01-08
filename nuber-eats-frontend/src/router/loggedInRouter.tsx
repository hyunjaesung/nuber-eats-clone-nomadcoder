import React from "react";
import { isLoggedInVar } from "../apollo";

export const LoggedInRouter = () => {
  const onClick = () => {
    isLoggedInVar(false); // 이렇게 만 해주면 된다
  };
  return (
    <div>
      <h1>loggedIn</h1>
      <button onClick={onClick}>click to Log out</button>
    </div>
  );
};
