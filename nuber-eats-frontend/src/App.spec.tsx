import React from "react";
import { render, waitFor } from "@testing-library/react";
import App from "./App";
import { isLoggedInVar } from "./apollo";

jest.mock("./router/loggedOutRouter", () => {
  return {
    LoggedOutRouter: () => <span>LoggedOut</span>,
  };
}); // 경로 쓰고 컴포넌트 mock으로 바꿔치기

jest.mock("./router/loggedInRouter", () => {
  return {
    LoggedInRouter: () => <span>LoggedIn</span>,
  };
});

describe("<App/>", () => {
  it("render loggedOutRouter 테스트", () => {
    // render 안에 리액트 컴포넌트 구문 에러나는 문제
    // 파일이름을 tsx 로 바꾸면된다

    // render(<App />); // 앱을 render하면서 에러 test해본다
    // App 만 바로 테스트하니까 깊이 들어가면서 아폴로 client가 없다고 에러가 난다
    // 우리가 알고싶은거는 단순히 App까지 렌더 분기가 잘되는지
    // mock을 해보자

    // render 함수는 많은 함수를 return 한다
    const { debug, getByText } = render(<App />);
    debug(); // 그려지는 html console.log
    getByText("LoggedOut"); // 해당 텍스트 있으면 통과
  });

  it("render loggedInRouter 테스트", async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      // state 업데이트 끝날때 까지 기다려주게한다
      isLoggedInVar(true); // reactive variable 을 조건문 통과를 위해 그냥 바꿔버린다
    });
    getByText("LoggedIn");
  });
});
