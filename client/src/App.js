import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import LogIn from './components/LogIn';
import Gallery from './components/Gallery';
import About from './components/About';
import Contact from './components/Contact';
import { BrowserRouter, Switch, Route } from 'react-router-dom' // Link
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'; // NavbarText
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faImages, faHome, faSignInAlt, faSignOutAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { BsHouse, BsImages, BsLock, BsUnlock, BsQuestionDiamond } from "react-icons/bs";

const Root = () => (
  <div className="general_bg">
    <br></br>
    <h2>Credential Store</h2>
    <p>What this web application is about...</p>
  </div>
);


class App extends Component {
  // TO DO 0.4: change bg when logged in
  // TO DO 0.8: Delete a photo from gallery
  // TO DO 1.0: Authenticate user and acc
  // TO DO 1.2: log out redirection

  // TO DO 1.4: avoid duplicate images in smart contract? preferably
  // TO DO 1.7: fix image layout, create mapping Image name->image
  // TO DO 2.0: fix internal/abstract function definitions in smart contract
  // TO DO 3.0: Create footer
  // TO DO 4.0: Create circular logo

  constructor(props) {
    super(props)

    this.state = {
      loggedIn: false,
      imageItems: [],
      fileName: 'Choose file',
      memeHash: '',
      imageArr: [],
      contract: null,
      web3: null,
      buffer: null,
      account: null
    }
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <main>
            <Navbar className="nav" expand="md">
              <NavbarBrand href="/"><Header /*subtitle="Credential Store"*/ /></NavbarBrand>
              <Nav className="mr-auto" navbar></Nav>                               {/* 9AEDED CEF9F2 80C2AF 669073 */}
              <NavItem><NavLink className="mr-auto nav_btn" href="/"><BsHouse size="2em" /></NavLink></NavItem>

              {(!JSON.parse(localStorage.getItem('state'))) ?
                <NavItem><NavLink className="nav_btn" href="/login"><BsUnlock size="2em" /></NavLink></NavItem>
                : ''}
              {(JSON.parse(localStorage.getItem('state'))) ?
                <NavItem><NavLink className="nav_btn" href="/gallery/"><BsImages size="2em" /></NavLink></NavItem>
                : ''}
              <NavItem><NavLink className="nav_btn" href="/contact"><BsQuestionDiamond size="2em" /></NavLink></NavItem>
              {(JSON.parse(localStorage.getItem('state'))) ?
                <NavItem><NavLink className="nav_btn" onClick={() => localStorage.clear()} href="/about"><BsLock size="2em" /></NavLink></NavItem>
                : ''}

              {/* <NavItem><NavLink className="nav_btn" href="/contact"><FontAwesomeIcon icon={faPaperPlane} size="2x" /></NavLink></NavItem> */}
            </Navbar>
            <Switch>
              <Route exact path='/' component={Root} />
              <Route path='/login' component={LogIn} />
              <Route path='/gallery' component={Gallery} />
              <Route path='/contact' component={Contact} />
              <Route path='/about' component={About} />
            </Switch>
          </main>
        </BrowserRouter>

        {/* <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <p>&nbsp;</p>
                <p>&nbsp;</p>
              </div>
            </main>
          </div>
        </div> */}

      </div>
    );
  }


}

export default App;