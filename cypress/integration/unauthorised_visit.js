describe('Test: Unauthorised app visit', () => {

  it('visits the gallery page & pdf viewer- not logged in', () => {
    cy.visit('http://localhost:3000/gallery')

    cy.get('#navbar').should('be.visible')

    cy.url().should('include', 'http://localhost:3000/gallery')

    window.localStorage.setItem('state', false)

    cy.waitForReact();
    cy.react('LogIn', { props: { newUser: 'false' } })
    cy.get('#not-logged-in').contains("User not logged in");

    cy.visit('http://localhost:3000/PdfViewer?1')
    cy.get('#navbar').should('be.visible')
    cy.url().should('include', 'http://localhost:3000/PdfViewer?1')
    cy.get('#user-not-logged-in').contains("User not logged in.");
  })

})
