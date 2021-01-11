import { render } from "@testing-library/react";
import React from "react";
import { Restaurant } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Restaurant/>", () => {
  it("renders Ok with props", () => {
    const props = {
      id: "1",
      coverImg: "x",
      name: "nameTest",
      categoryName: "catTest",
    };
    const { debug, getByText, container } = render(
      <Router>
        <Restaurant {...props} />
      </Router>
    );
    // Link가 Router 밖에 쓰일 수 없다고 에러가 난다
    // test를 위한 Router를 import

    getByText(props.name);
    getByText(props.categoryName);

    // html attribute 체크
    expect(container.firstChild).toHaveAttribute(
      "href",
      `/restaurants/${props.id}`
    );
  });
});
