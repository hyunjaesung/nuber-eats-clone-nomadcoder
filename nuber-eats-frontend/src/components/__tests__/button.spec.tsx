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
