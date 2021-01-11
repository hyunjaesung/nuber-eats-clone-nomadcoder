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
