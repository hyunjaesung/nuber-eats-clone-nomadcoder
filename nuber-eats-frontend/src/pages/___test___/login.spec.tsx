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

  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });

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

  it("display password required errors", async () => {
    const { getByPlaceholderText, getByRole, debug } = renderResult;

    const email = getByPlaceholderText(/email/i);
    const submitBtn = getByRole("button");

    await waitFor(() => {
      userEvent.type(email, "this@success.com");
      userEvent.click(submitBtn);
    });

    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Password is required/i);
  });

  it("submit form and calls mutation", async () => {
    const formData = {
      email: "real@test.com",
      password: "123",
    };

    const { getByPlaceholderText, getByRole, debug } = renderResult;
    const email = getByPlaceholderText(/email/i); // email input 창 찾기
    const password = getByPlaceholderText(/password/i); // password input 창 찾기
    const submitBtn = getByRole("button");

    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "asdfafd",
          error: "errorForTest",
        },
      },
    });

    // 첫번째 인자에는 실제 GraphQL문 사용
    // 해당 GraphQL문이 호출 되었을때 호출되고 결과 return하는 콜백 함수가 두번째 인자
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    jest.spyOn(Storage.prototype, "setItem");

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
    expect(localStorage.setItem).toHaveBeenCalledWith("nuber-token", "asdfafd");

    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/errorForTest/i);
  });
});
