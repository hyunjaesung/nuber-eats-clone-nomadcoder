describe("Create Account", () => {
  it("should see email / password validation errors", () => {
    cy.visit("/");
    cy.findByText(/create an account/i).click();
    cy.findByPlaceholderText(/email/i).type("non@good");
    cy.findByRole("alert").should("have.text", "Please enter a valid email");
    cy.findByPlaceholderText(/email/i).clear();
    cy.findByRole("alert").should("have.text", "Email is required");
    cy.findByPlaceholderText(/email/i).type("real@mail.com");
    cy.findByPlaceholderText(/password/i)
      .type("a")
      .clear();
    cy.findByRole("alert").should("have.text", "Password is required");
  });

  it("should be able to create account and login", () => {
    cy.intercept("http://localhost:4000/graphql", (req) => {
      req.reply((res) => {
        const { operationName } = req.body;

        // 모든 해당 도메인 response를 바꾸고 싶지 않으면 조건 걸어줘야한다
        // 안걸면 밑에 로그인도 이걸로 가서 token 안온다
        if (operationName && operationName === "createAccountMutation") {
          res.send({
            // 네트워크 탭에서 res 복붙해와서 원하는대로 바꿈
            // data: {
            //   createAccount: {
            //     ok: true,
            //     error: null,
            //     __typename: "CreateAccountOutput",
            //   },
            // },
            fixture: "auth/createAccount.json",
          });
        }
      });
    });
    // 실제 있어도 존재 하지 않는 척으로 가짜로 만듦
    // 아래 테스트로 하면 있는 계정이라 원래 ok false 와야한다

    cy.visit("/create-account");
    cy.findByPlaceholderText(/email/i).type("test@test.com");
    cy.findByPlaceholderText(/password/i).type("123");
    cy.findByRole("button").click();
    cy.wait(1000);
    cy.login("test@test.com", "123");
    cy.title().should("eq", "Login | Nuber Eats");
    cy.assertLoggedIn();
  });
});
