describe('Login spec', () => {
  it('should login successfull', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
  })

  it('should throw an error when the form is incorrect', () => {
    cy.intercept('POST', '/api/auth/login', {
      "statusCode": 404,
      "body" : {}
    }).as('loginError')

    cy.visit('/login')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.wait('@loginError');

    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'An error occurred');

    cy.url().should('include', '/login')
  })
});