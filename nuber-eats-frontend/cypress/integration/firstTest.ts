describe("Log In", () => {
  const user = cy;
  it("should see login page", () => {
    cy.visit("/").title().should("eq", "Login | Nuber Eats");
  });

  it("can fill out the form", () => {
    // 소프트웨어 가서 좌측 상단 표식 모양 누르면 원하는 태그 알수있다
    user
      .visit("/")
      .get('[name="email"]')
      .type("test8@test.com")
      .get('[name="password"]')
      .type("123")
      .get(".text-lg")
      .should("not.have.class", "pointer-events-none")
      .click();

    // window 객체 접근 해서 테스트
    user.window().its("localStorage.nuber-token").should("be.a", "string");
  });

  it("can see email password validation errors", () => {
    // testing library 를 이용한 방법
    // testing library 메서드 쓸때마다 cy 분리 해야한다
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("notEmailsdffiof");
    user.findByRole("alert").should("have.text", "Please enter a valid email");

    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");

    user.findByPlaceholderText(/email/i).type("email@email.com");
    user
      .findByPlaceholderText(/password/i)
      .type("a")
      .clear()
      .click();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  // it 들이 다 분리 되어있어서 굳이 로그아웃 안해도 처음부터 테스트 다시시작
  it("move to create Account", () => {
    user.visit("/create-account");
  });
});
