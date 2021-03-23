describe('Test: Visit the app', () => {

  it('visits the app', () => {
    cy.visit('http://localhost:3000')
    cy.get('#navbar').should('be.visible')
    cy.get('#nav-about').should('be.visible')
    cy.get("h3").contains("Storing files on Ethereum has never been easier.")
    cy.url().should('include', 'http://localhost:3000')
    // cy.get('#start-btn').trigger('accountsChanged')
    // cy.clearLocalStorage().then((ls) => {
    //   expect(ls.getItem('state')).to.be.null
    // })
    cy.get('#start-btn').click();
    window.localStorage.setItem('state', false)
    cy.visit('http://localhost:3000/login')
  })

})