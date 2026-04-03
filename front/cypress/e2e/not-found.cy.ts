describe('Not found spec', () => {
    it('should show not found message', () => {
        cy.visit('/404')

        cy.get('[data-testid="not-found-message"]')
            .should('contain', 'Page not found !');
    })
});