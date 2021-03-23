describe('Test: Upload and share images and files', () => {

  it('uploads image', () => {
    cy.visit('http://localhost:3000/login')
    cy.get('#navbar').should('be.visible')
    cy.get('#nav-about').should('be.visible')
    cy.get('#login').should('be.visible')

    cy.url().should('include', 'http://localhost:3000/login')
    window.localStorage.setItem('state', false)

    cy.waitForReact();
    cy.react('LogIn', { props: { newUser: 'false' } })
    cy.get('#login-data').should('be.visible');

    // Login with correct credentials
    const correct_input = "Theodora"
    cy.get('#input-usr').type(correct_input).should('have.value', correct_input)
    cy.get('#submit-btn').click();
    cy.wait(6000)
    cy.get('#nav-gallery', { timeout: 20000 }).should('be.visible')
    cy.get('#nav-sharepoint').should('be.visible')

    // Gallery: Upload image with long image
    cy.get('#upload-file').attachFile('testVeryVeryVeryLongImageName.jpg', { subjectType: 'drag-n-drop' });
    cy.get('#submit-file').click({ timeout: 60000 });
    cy.on('window:confirm', (txt) => {
      expect(txt).to.contains('File name is too large to be stored in the blockchain, please try a shorter name.');
    })

    // Gallery: Upload file - type not supported
    cy.get('#upload-file').attachFile('testWrongTypeFile.json', { subjectType: 'drag-n-drop' });
    cy.get('#submit-file').click({ timeout: 60000 });
    cy.on('window:confirm', (txt) => {
      expect(txt).to.contains('File type is not supported. \nOnly pdf, jpg, jpeg, png, gif file types are supported.');
    })

    // Gallery: No file was selected to upload
    cy.get('#submit-file').click({ timeout: 60000 });
    cy.on('window:confirm', (txt) => {
      expect(txt).to.contains('No file was selected. Please try again.');
    })

    // Gallery: Upload Image
    cy.get('#upload-file').attachFile('testImage.jpeg', { subjectType: 'drag-n-drop' });
    cy.get('#submit-file').click({ timeout: 60000 });

    // Gallery: Upload File
    cy.get('#upload-file').attachFile('testFile.pdf', { subjectType: 'drag-n-drop' });
    cy.get('#submit-file').click({ timeout: 60000 });

    // Gallery: Open and close image details modal
    cy.get('#image-details').click();
    cy.get('#details-modal-header').click('topRight', { timeout: 60000 });

    cy.get('#uncontrolled-tab-example-tab-files').click();

    // Gallery: Open and close file details modal
    cy.get('#file-details').click();
    cy.get('#details-modal-header').click('topRight', { timeout: 60000 });

    // Gallery: Download file
    cy.get('#download-file-btn').click({ timeout: 20000 })

    // Gallery: Share file (wrong address)
    cy.get('#share-file-btn').click();
    const wrong_address = "wrong"
    cy.get('#input-address').type(wrong_address).should('have.value', wrong_address)
    cy.get('#agree').click();
    cy.get('#share-file').click()
    cy.on('window:confirm', (txt) => {
      expect(txt).to.contains('Wrong public address entered or Request was rejected.');
    })

    // Gallery: Share file (already shared)
    cy.get('#share-file-btn').click();
    const already_shared_addr = "0xA319A7A58f6d0dbE1F1621dD33E24a7a7c484d0a"
    cy.get('#input-address').type(already_shared_addr).should('have.value', already_shared_addr)
    cy.get('#agree').click();
    cy.get('#share-file').click()
    cy.get('#already-shared-warning').contains('You have already shared this file with that user.');
    cy.get('#share-modal-header').click('topRight', { timeout: 60000 });

    // Gallery: Share file (No public address was entered)
    cy.get('#share-file-btn').click();
    cy.get('#share-file').click()
    cy.on('window:confirm', (txt) => {
      expect(txt).to.contains('No public address was entered. Please enter a public address.');
    })
    cy.get('#share-modal-header').click('topRight', { timeout: 60000 });

    // Gallery: Share file (Cannot share files with yourself)
    const test_self_address = '0x067cFF7BA21e57A9727077aeb4015E6527A0F41C'
    cy.get('#share-file-btn').click();
    cy.get('#input-address').type(test_self_address).should('have.value', test_self_address)
    cy.get('#share-file').click()
    cy.on('window:confirm', (txt) => {
      expect(txt).to.contains('Cannot share files with yourself.');
    })
    cy.get('#share-modal-header').click('topRight', { timeout: 60000 });

    cy.visit('http://localhost:3000/about')
    cy.url().should('include', 'http://localhost:3000/about')

    cy.visit('http://localhost:3000')
    cy.url().should('include', 'http://localhost:3000')
    cy.get('#start-btn').click();

    cy.visit('http://localhost:3000/gallery')

    // Gallery: Download image
    cy.get('#download-btn').click({ timeout: 20000 })

    // Gallery: Share image (wrong address) 
    cy.get('#share-btn').click();
    const wrong_addr = "Theo"
    cy.get('#input-address').type(wrong_addr).should('have.value', wrong_addr)
    cy.get('#agree').click();
    cy.get('#share-file').click()
    cy.on('window:confirm', (txt) => {
      expect(txt).to.contains('Wrong public address entered or Request was rejected.');
    })

    // Gallery: Share image (already shared)
    cy.get('#share-btn').click();
    cy.get('#input-address').type(already_shared_addr).should('have.value', already_shared_addr)
    cy.get('#agree').click();
    cy.get('#share-file').click()
    cy.get('#already-shared-warning').contains('You have already shared this file with that user.');
    cy.get('#share-modal-header').click('topRight', { timeout: 60000 });

    // Gallery: Open and close image modal
    cy.get('#uploaded-image').click();
    cy.get('.react-images__header_button--close > .css-9s8aw7').click();

    cy.visit('http://localhost:3000/sharepoint')
    cy.url().should('include', 'http://localhost:3000/sharepoint')

    // Sharepoint: Reverse Images
    cy.get('#reverse-images').click();
    // Sharepoint: Images go back to original
    cy.get('#reverse-images').click();

    // Sharepoint: Open and close normal image modal 
    cy.get('#normal-image').click();
    cy.get('.react-images__header_button--close > .css-9s8aw7').click();

    // Sharepoint: Open and close view only image
    cy.get('#view-only-image').click();
    cy.get('.react-images__header_button--close > .css-9s8aw7').click();

    // Sharepoint: Open and close image details modal
    cy.get('#image-details').click();
    cy.get('#details-modal-header').click('topRight', { timeout: 60000 });

    // Sharepoint: Download image
    cy.get('#download-btn').click({ timeout: 20000 })
    cy.on('uncaught:exception', (err, runnable) => {
      done()
      return false
    })
    cy.wait(3000)

    // Sharepoint: Share image (wrong address)
    cy.get('#share-btn').click();
    const wrong_addr_share = "Theo"
    cy.get('#input-address').type(wrong_addr_share).should('have.value', wrong_addr_share)
    cy.get('#agree').click();
    cy.get('#share-file').click()
    cy.on('window:confirm', (txt) => {
      expect(txt).to.contains('Wrong public address entered or Request was rejected.');
    })

    // Sharepoint: Share image (already shared)
    cy.get('#share-btn').click();
    cy.get('#input-address').type(already_shared_addr).should('have.value', already_shared_addr)
    cy.get('#agree').click();
    cy.get('#share-file').click()
    cy.get('#already-shared-warning').contains('You have already shared this file with that user.');
    cy.get('#share-modal-header').click('topRight', { timeout: 60000 });

    cy.get('#uncontrolled-tab-example-tab-files').click();

    // Sharepoint: Reverse Files
    cy.get('#reverse-files').click();
    // Sharepoint: Files go back to original
    cy.get('#reverse-files').click();

    // Sharepoint: Open and close file details modal
    cy.get(':nth-child(2) > :nth-child(6) > #file-details').click();
    cy.get('#details-modal-header').click('topRight', { timeout: 60000 });

    // Sharepoint: Download file
    cy.get('#download-file-btn').click({ timeout: 20000 })
    cy.on('uncaught:exception', (err, runnable) => {
      done()
      return false
    })
    cy.wait(3000)

    // Sharepoint: Share file (wrong address)
    cy.get('#share-file-btn').click();
    const wrong_addr_share_file = "Theo"
    cy.get('#input-address').type(wrong_addr_share_file).should('have.value', wrong_addr_share_file)
    cy.get('#agree').click();
    cy.get('#share-file').click()
    cy.on('window:confirm', (txt) => {
      expect(txt).to.contains('Wrong public address entered or Request was rejected.');
    })

    // Sharepoint: Share file (already shared)
    cy.get('#share-file-btn').click();
    cy.get('#input-address').type(already_shared_addr).should('have.value', already_shared_addr)
    cy.get('#agree').click();
    cy.get('#share-file').click()
    cy.get('#already-shared-warning').contains('You have already shared this file with that user.');
    cy.get('#share-modal-header').click('topRight', { timeout: 60000 });

    // Sharepoint: Share file (No public address was entered)
    cy.get('#share-file-btn').click();
    cy.get('#share-file').click()
    cy.on('window:confirm', (txt) => {
      expect(txt).to.contains('No public address was entered. Please enter a public address.');
    })
    cy.get('#share-modal-header').click('topRight', { timeout: 60000 });

    // Sharepoint: Share file (Cannot share files with yourself)
    cy.get('#share-file-btn').click();
    cy.get('#input-address').type(test_self_address).should('have.value', test_self_address)
    cy.get('#share-file').click()
    cy.on('window:confirm', (txt) => {
      expect(txt).to.contains('Cannot share files with yourself.');
    })
    cy.get('#share-modal-header').click('topRight', { timeout: 60000 });

    // Sharepoint: Display normal pdf
    cy.get('#view-pdf').should('have.attr', 'target', '_blank').should('have.attr', 'rel', 'noopener noreferrer');
    cy.get('#view-pdf').click()

    // Sharepoint: Display view-only pdf
    cy.get('#view-only-pdf').click();
    cy.wait(6000)

    cy.visit('http://localhost:3000/PdfViewer?0')
    cy.url().should('include', 'http://localhost:3000/PdfViewer?0')

    // Sharepoint: Display next and previous pages of view-only pdf
    cy.wait(8000)
    cy.get('#next-btn').click({ timeout: 2000 })
    cy.wait(5000)
    cy.get('#next-btn').click({ timeout: 2000 })
    cy.wait(5000)
    cy.get('#previous-btn').click({ timeout: 2000 })

    cy.visit('http://localhost:3000/sharepoint')

    // Sharepoint: Open and close image modal
    cy.get('#normal-image').click();
    cy.get('*[class^="react-images__positioner css-rd9bp css-1ycyyax"]').click('topRight', { timeout: 60000 });

    // Sharepoint: File not chosen to display (non existent file)
    cy.visit('http://localhost:3000/PdfViewer?5')
    cy.url().should('include', 'http://localhost:3000/PdfViewer?5')
    cy.get('#file-not-chosen').contains("File not chosen to display.");

    cy.visit('http://localhost:3000/login')
    cy.get('#logged-in').contains('You are already logged in.')

    // Logout 
    cy.get('#logout').click();
    cy.url().should('include', 'http://localhost:3000')

    // Clear user data
    cy.clearLocalStorage().then((ls) => {
      expect(ls.getItem('state')).to.be.null
    })

    // Return to login page
    cy.get('#login').click();
    cy.url().should('include', 'http://localhost:3000/login')

  })
})
