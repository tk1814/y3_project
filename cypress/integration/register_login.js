describe('Test: Register and login', () => {

  it('visits the login page', () => {
    cy.visit('http://localhost:3000/login')
    cy.get('#navbar').should('be.visible')
    cy.get('#nav-about').should('be.visible')

    cy.url().should('include', 'http://localhost:3000/login')
    window.localStorage.setItem('state', false)
    cy.waitForReact();
    cy.react('LogIn', { props: { newUser: 'false' } })
    cy.get('#login-data').should('be.visible');

    cy.get('h3').then(($h3) => {

      // new user
      // if ($h3.text().includes('Connect your MetaMask account with just one click. Enter your username to sign up.')) {

        // terms & conditions not accepted
        const input = "Theodora"
        cy.get('#input-usr').type(input).should('have.value', input)
        cy.get('#submit-btn').click();
        cy.get('#terms-conditions').contains("Please accept the terms and conditions to proceed.");
        cy.get('#input-usr').clear()

        // username with spaces
        const input_spaces = "new user"
        cy.get('#input-usr').type(input_spaces).should('have.value', input_spaces)
        // accept terms & conditions
        cy.get('#agree').click();
        cy.get('#submit-btn').click();
        cy.get('#no-spaces').contains("Username must be without whitespaces.");
        cy.get('#input-usr').clear()

        // username already exists
        cy.get('#input-usr').type(input).should('have.value', input)
        cy.get('#submit-btn').click();
        cy.get('#username-exists').contains("This username already exists, please choose a different one.");

        cy.get('#input-usr').clear()
        const correct_input = "newUsername"
        cy.get('#input-usr').type(correct_input).should('have.value', correct_input)
        cy.wait(6000)
        cy.get('#submit-btn').click(); // register

      } else { // login

        // wrong credentials
        const wrong_input = "Theo1"
        cy.get('#input-usr').type(wrong_input).should('have.value', wrong_input)
        cy.get('#submit-btn').click();
        cy.get('#wrong-login').contains("Your login credentials could not be verified.");

        // correct credentials
        cy.get('#input-usr').clear()
        const correct_input = "Theodora"
        cy.get('#input-usr').type(correct_input).should('have.value', correct_input)
        cy.get('#submit-btn').click();  // login
        cy.wait(6000)
        cy.get('#nav-gallery').should('be.visible')
        cy.get('#nav-sharepoint').should('be.visible')

      }
    })
  })

})