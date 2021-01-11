import { render } from "@testing-library/react";
import React from "react";
import { FormError } from "../formError";

describe("<FormError />", () => {
  it("render Ok with props", () => {
    const { getByText } = render(<FormError errorMessage='test' />);
    getByText("test");
  });
});
