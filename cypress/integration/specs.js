// import Web3 from "web3";
// import PrivateKeyProvider from "truffle-privatekey-provider";

describe('Cypress', () => {

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


  it('visits the login page', () => {
    cy.visit('http://localhost:3000/login')
    cy.get('#navbar').should('be.visible')
    cy.get('#nav-about').should('be.visible')

    cy.url().should('include', 'http://localhost:3000/login')
    window.localStorage.setItem('state', false)
    // window.localStorage.getItem('state');
    // cy.window().its('store').invoke('getState').should('exist')
    // cy.window().its('store').invoke('getState').should('deep.equal', false)

    cy.waitForReact();
    cy.react('LogIn', { props: { newUser: 'false' } })

    cy.get('#login-data').should('be.visible');

    cy.get('h3').then(($h3) => {
      console.log($h3.text())

      // new user
      if ($h3.text().includes('Connect your MetaMask account with only one click. Enter your username to sign up.')) {

        // terms & conditions not accepted
        const input = "Theo"
        cy.get('#input-usr').type(input).should('have.value', input)
        cy.get('#submit-btn').click();
        cy.get('#terms-conditions').contains("Please accept the terms and conditions to proceed.");
        cy.get('#input-usr').clear()

        // username with spaces
        const input_spaces = "Th eo"
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

        // cy.get('#input-usr').clear()
        // const correct_input = "Geo"
        // cy.get('#input-usr').type(correct_input).should('have.value', correct_input)
        // cy.get('#submit-btn').click();

      } else { // login

        // wrong credentials
        const wrong_input = "Theo1"
        cy.get('#input-usr').type(wrong_input).should('have.value', wrong_input)
        cy.get('#submit-btn').click();
        cy.get('#wrong-login').contains("Your login credentials could not be verified.");

        // correct credentials
        cy.get('#input-usr').clear()
        const correct_input = "Theo"
        cy.get('#input-usr').type(correct_input).should('have.value', correct_input)
        // UNCOMMENT 70% COVERAGE 
        cy.get('#submit-btn').click();
        cy.wait(4000) //<<<<<<<<
        cy.get('#nav-gallery').should('be.visible')
        cy.get('#nav-sharepoint').should('be.visible')

      }
    })
  })



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



  it('uploads image', () => {
    cy.visit('http://localhost:3000/login')
    cy.get('#navbar').should('be.visible')
    cy.get('#nav-about').should('be.visible')
    cy.get('#login').should('be.visible')

    cy.url().should('include', 'http://localhost:3000/login')
    window.localStorage.setItem('state', false)
    // window.localStorage.getItem('state');
    // cy.window().its('store').invoke('getState').should('exist')
    // cy.window().its('store').invoke('getState').should('deep.equal', false)

    cy.waitForReact();
    cy.react('LogIn', { props: { newUser: 'false' } })
    cy.get('#login-data').should('be.visible');

    // correct credentials
    const correct_input = "Theo"
    cy.get('#input-usr').type(correct_input).should('have.value', correct_input)
    // UNCOMMENT 70% COVERAGE 
    cy.get('#submit-btn').click();
    cy.get('#nav-gallery', { timeout: 20000 }).should('be.visible')
    cy.get('#nav-sharepoint').should('be.visible')

    cy.get('#upload-file').attachFile('testWrongTypeFile.json', { subjectType: 'drag-n-drop' });
    cy.get('#submit-file').click({ timeout: 60000 });
    cy.on('window:confirm', (txt) => {
      expect(txt).to.contains('File type is not supported. \nOnly pdf, jpg, jpeg, png, gif file types are supported.');
    })

    cy.get('#submit-file').click({ timeout: 60000 });
    cy.on('window:confirm', (txt) => {
      expect(txt).to.contains('No file was selected. Please try again.');
    })

    cy.get('#upload-file').attachFile('testImage.jpeg', { subjectType: 'drag-n-drop' });
    cy.get('#submit-file').click({ timeout: 60000 });

    cy.get('#upload-file').attachFile('testFile.pdf', { subjectType: 'drag-n-drop' });
    cy.get('#submit-file').click({ timeout: 60000 });

    // open and close modal
    cy.get('#image-details').click();
    cy.get('#details-modal-header').click('topRight', { timeout: 60000 });

    cy.get('#uncontrolled-tab-example-tab-files').click();
    cy.get('#file-details').click();
    cy.get('#details-modal-header').click('topRight', { timeout: 60000 });
    // download & share file
    cy.get('#download-file-btn').click({ timeout: 20000 })
    // share-file-btn
    // import {}

    //   // No public address was entered
    cy.get('#share-file-btn').click();
    //   cy.on('window:alert',(txt)=>{
    //     expect(txt).to.contains('No public address was entered. Please enter a public address.');
    //  })
    //   cy.get('#share-file').click()

    // const demo_address = "0xA319A7A58f6d0dbE1F1621dD33E24a7a7c484d0a"
    // cy.get('#input-address').type(demo_address).should('have.value', demo_address)
    const wrong_address = "wrong"
    cy.get('#input-address').type(wrong_address).should('have.value', wrong_address)
    cy.get('#agree').click();
    cy.get('#share-file').click()

    //>>>>>>>
    // cy.get('#share-file-btn').click();
    // const demo_address = "0xA319A7A58f6d0dbE1F1621dD33E24a7a7c484d0a"
    // cy.get('#input-address').type(demo_address).should('have.value', demo_address)
    // cy.get('#share-file').click()
    // //<<<<<<<
    // cy.wait(8000)

    cy.get('#uncontrolled-tab-example-tab-gallery').click();
    cy.get('#download-btn').click({ timeout: 20000 })

    cy.on('uncaught:exception', (err, runnable) => {
      done()
      return false
    })
    cy.wait(3000)
    cy.visit('http://localhost:3000/about')
    cy.url().should('include', 'http://localhost:3000/about')

    // cy.react('About', { props: { account: { name: 'email' } } }).type(
    //   'john.doe@cypress.com'
    // );



    cy.visit('http://localhost:3000')
    cy.url().should('include', 'http://localhost:3000')
    cy.get('#start-btn').click();

    cy.visit('http://localhost:3000/gallery')

    cy.get('#share-btn').click();
    const wrong_addr = "Theo"
    cy.get('#input-address').type(wrong_addr).should('have.value', wrong_addr)
    cy.get('#agree').click(); // already shared with: 0x49b34364948c8839855446494E91d33bF578F8d3
    cy.get('#share-file').click()

    //>>>>>>>
    // cy.get('#share-btn').click();
    // cy.get('#input-address').type(demo_address).should('have.value', demo_address)
    // cy.get('#share-file').click()
    //<<<<<<<

    // open image modal and close it
    cy.get('#uploaded-image').click(); 
    cy.get('body').trigger("keydown", { key: "esc" });

    // cy.get('#nav-sharepoint').click();
    cy.visit('http://localhost:3000/sharepoint')
    cy.url().should('include', 'http://localhost:3000/sharepoint')

    cy.get('#image-details').click();
    cy.get('#details-modal-header').click('topRight', { timeout: 60000 });


    cy.get('#download-btn').click({ timeout: 20000 })
    cy.on('uncaught:exception', (err, runnable) => {
      done()
      return false
    })
    cy.wait(3000)


    cy.get('#share-btn').click();
    const wrong_addr_share = "Theo"
    cy.get('#input-address').type(wrong_addr_share).should('have.value', wrong_addr_share)
    cy.get('#agree').click();
    // already shared with: 0x49b34364948c8839855446494E91d33bF578F8d3
    cy.get('#share-file').click()


    /////////
    cy.get('#uncontrolled-tab-example-tab-files').click();
    cy.get('#file-details').click();
    cy.get('#details-modal-header').click('topRight', { timeout: 60000 });

    cy.get('#download-file-btn').click({ timeout: 20000 })
    cy.on('uncaught:exception', (err, runnable) => {
      // expect(err.message).to.include('something about the error')
      done()
      return false
    })
    cy.wait(3000)

    cy.get('#share-file-btn').click();
    const wrong_addr_share_file = "Theo"
    cy.get('#input-address').type(wrong_addr_share_file).should('have.value', wrong_addr_share_file)
    cy.get('#agree').click();
    // already shared with: 0x49b34364948c8839855446494E91d33bF578F8d3
    cy.get('#share-file').click()

    cy.get('#view-pdf')
      .should('have.attr', 'target', '_blank')
      .should('have.attr', 'rel', 'noopener noreferrer');

    cy.get('#view-pdf').then(link => {
      cy.request(link.prop('href')).its('status').should('eq', 200);
    });

    cy.get('#view-pdf').click()

    cy.get('#view-only-pdf').click();
    cy.wait(6000)

    cy.visit('http://localhost:3000/PdfViewer?0')
    cy.url().should('include', 'http://localhost:3000/PdfViewer?0')

    cy.wait(7000)
    cy.get('#next-btn').click({ timeout: 2000 })
    cy.wait(5000)
    cy.get('#previous-btn').click({ timeout: 2000 })


    // click image 
    cy.visit('http://localhost:3000/sharepoint')
    cy.get('#normal-image').click();
    cy.get('*[class^="react-images__positioner css-rd9bp css-1ycyyax"]').click('topRight', { timeout: 60000 });
    // ^^^^^^^^^^^^^^ 

    // File not chosen to display
    cy.visit('http://localhost:3000/PdfViewer?5')
    cy.url().should('include', 'http://localhost:3000/PdfViewer?5')
    cy.get('#file-not-chosen').contains("File not chosen to display.");


    cy.visit('http://localhost:3000/login')
    cy.get('#logged-in').contains('You are already logged in.')


    // press logout
    cy.get('#logout').click();
    cy.url().should('include', 'http://localhost:3000')

    cy.clearLocalStorage().then((ls) => {
      expect(ls.getItem('state')).to.be.null
    })

    cy.get('#login').click();
    cy.url().should('include', 'http://localhost:3000/login')


  })






  // it("I can increment number of clicks", () => {

  //   cy.visit('localhost:3000', {
  //     onBeforeLoad(win) {
  //       win.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.top.__REACT_DEVTOOLS_GLOBAL_HOOK__
  //     },
  //   })
  // });


  // it("I can increment number of clicks", () => {
  //   cy.on("window:before:load", (win) => {
  //     const provider = new PrivateKeyProvider(
  //       "28e01aace89205e308edcf1b86bf71fa67727d7440f3762d1788d700ec32ca91",
  //       "http://localhost:7545"
  //     );
  //     win.web3 = new Web3(provider);
  //   });

  //   cy.visit("http://localhost:3000");

  //   cy.wait(1000);

  //   cy.get("#clicks").then($btn => {
  //     const current = parseInt($btn.text(), 10);
  //     const expected = current + 1;

  //     cy.contains("Click").click();
  //     cy.get("#clicks").contains(expected);
  //   });
  // });




















  // it('visits the gallery page - not logged in', () => {
  //   cy.visit('http://localhost:3000/gallery')

  //   cy.get('#navbar').should('be.visible')

  //   cy.url().should('include', 'http://localhost:3000/gallery')

  //   window.localStorage.setItem('state', false)

  //   cy.waitForReact();
  //   cy.react('LogIn', { props: { newUser: 'false' } })
  //   cy.get('#not-logged-in').contains("User not logged in");


  //   // wrong credentials
  //   const wrong_input = "Theo1"
  //   cy.get('#input-usr').type(wrong_input).should('have.value', wrong_input)
  //   cy.get('#submit-btn').click();
  //   cy.get('#wrong-login').contains("Your login credentials could not be verified.");

  //   // correct credentials
  //   cy.get('#input-usr').clear()
  //   const correct_input = "Theo"
  //   cy.get('#input-usr').type(correct_input).should('have.value', correct_input)
  //   // cy.get('#submit-btn').click();
  //   // window.localStorage.setItem('state', true)

  //   cy.visit('http://localhost:3000/gallery')

  // })


  // it('visits the login page', () => {
  //   cy.visit('http://localhost:3000/login')

  //   cy.get('#navbar').should('be.visible')

  //   cy.url().should('include', 'http://localhost:3000/login')

  //   // cy.contains('Get Started').click()
  //   window.localStorage.setItem('state', false)

  //   const input = "Theo"
  //   cy.get('#input-usr').type(input).should('have.value', input)
  //   cy.get('#agree').click();

  //   // cy.mount(<LogIn />)
  //   // cy.get('.newUser')
  //   // .invoke('setState', { newUser: 'true' })
  //   // cy.get(HelloState).its('state').should('deep.equal', { name: 'React' })
  //   // cy.contains('Hello React!')
  //   // cy.get('#submit-btn').click();

  //   window.localStorage.setItem('state', false)

  //   // cy.visit('http://localhost:3000/gallery')


  //   // cy.url().should('include', '/login')

  //   // cy.url().should('include', 'http://localhost:3000/login')
  //   // , {timeout:100000}


  //   // cy.location('href').should('include', '/login')
  //   // cy.location('/login').should('eq', '/login')

  // })

  // it('visits the login page', () => {
  //   cy.visit('http://localhost:3000/login')

  //   cy.url().should('include', 'http://localhost:3000/login')

  //   cy.contains('Get Started').click()
  // cy.focused().should('have.class', 'form-control')

  // const input = "theo"
  // cy.get('.form-control').type(input).should('have.value', input)

  //   cy.get('.btn').first().click();
  //   // cy.location('/login').should('eq', '/login')

  // })





  // it('visits the login page', () => {
  //   cy.visit('http://localhost:3000/login')

  //   cy.get('#navbar').should('be.visible')

  //   cy.url().should('include', 'http://localhost:3000/login')

  //   window.localStorage.setItem('state', false)

  //   // mount(<LogIn />)
  //   cy.waitForReact();
  //   cy.react('LogIn');

  //   // terms & conditions not accepted
  //   const input = "Theo"
  //   cy.get('#input-usr').type(input).should('have.value', input)
  //   cy.get('#submit-btn').click();
  //   cy.get('#terms-conditions').contains("Please accept the terms and conditions to proceed.");
  //   cy.get('#input-usr').clear()

  //   // username with spaces
  //   const input_spaces = "Th eo"
  //   cy.get('#input-usr').type(input_spaces).should('have.value', input_spaces)
  //   // accept terms & conditions
  //   cy.get('#agree').click();
  //   cy.get('#submit-btn').click();
  //   cy.get('#no-spaces').contains("Username must be without whitespaces.");
  //   cy.get('#input-usr').clear()

  //   // username already exists
  //   cy.get('#input-usr').type(input).should('have.value', input)
  //   cy.get('#submit-btn').click();
  //   cy.get('#username-exists').contains("This username already exists, please choose a different one.");

  //   // cy.get('#input-usr').clear()



  //   // wrong credentials
  //   // const wrong_input = "Theo1"
  //   // cy.get('#input-usr').type(wrong_input).should('have.value', wrong_input)
  //   // cy.get('#submit-btn').click();
  //   // cy.get('#wrong-login').contains("Your login credentials could not be verified.");

  //   // correct credentials
  //   cy.get('#input-usr').clear()
  //   const correct_input = "Theo2"
  //   cy.get('#input-usr').type(correct_input).should('have.value', correct_input)
  //   cy.get('#submit-btn').click();

  //   window.localStorage.setItem('state', false)



  //   // cy.url().should('include', 'http://localhost:3000/gallery')
  //   // window.localStorage.setItem('state', false)
  // })

})