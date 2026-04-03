describe('Register spec', () => {
  it('shoud register successfull', () => {
    cy.visit('/register')

    cy.intercept('POST', '/api/auth/register', {})

    cy.get('input[formControlName=firstName]').type("firstName")
    cy.get('input[formControlName=lastName]').type("lastName")
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/login')
  })

  it('shoud throw an error when email already used', () => {
    cy.intercept('POST', '/api/auth/register', {
      "statusCode": 400,
      "body" : {"message": "Error: Email is already taken!"}
    }).as('registerError')

    cy.visit('/register')

    cy.get('input[formControlName=firstName]').type("firstName")
    cy.get('input[formControlName=lastName]').type("lastName")
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.wait('@registerError');

    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'An error occurred');

    cy.url().should('include', '/register')
  })
});