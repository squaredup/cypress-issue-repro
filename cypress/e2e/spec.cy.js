describe("template spec", () => {
  it("Cypress hangs when pageLoadTimeout fired during cy.origin", () => {
    cy.loginWithMicrosoftAccountAndSelectOrg({
      username: Cypress.env("AAD_USER"),
      password: Cypress.env("AAD_PASSWORD"),
      clickAadTile: false,
      clickDontRemainSignedIn: true,
      orgButtonText: Cypress.env("AAD_ORG")
    });

    cy.get('[data-testid="nav-bar"]').should("be.visible");
  });
});
