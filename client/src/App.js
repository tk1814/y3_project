import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import LogIn from './components/LogIn';
import Gallery from './components/Gallery';
import Sharepoint from './components/Sharepoint';
import { BrowserRouter, Switch, Route } from 'react-router-dom' // Link
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'; // NavbarText
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faImages, faHome, faSignInAlt, faSignOutAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { BsHouse, BsImages, BsLock, BsUnlock, BsQuestionDiamond } from "react-icons/bs";
import { BiShareAlt } from "react-icons/bi";
// import Carousel from 'react-images';
// import img1 from './bg/55.jpg';
// import img2 from './bg/dsk.jpg';
// const images = [{ source: img1 }, { source: img2 }];

const Root = () => (
  <div className="general_bg">
    <div className="top_space">
      <h4>Simpler Safer Faster</h4>
      <h3 className="mt-4">Storing images on Ethereum has never been easier.</h3>
      {(JSON.parse(localStorage.getItem('state'))) ?
        <a href="/gallery" className="btn start_btn mt-5" role="button">Get Started</a>
        : <a href="/login" className="btn start_btn mt-5" role="button">Get Started</a>}
    </div>
  </div>
);


class App extends Component {

  // TO DO 1.0: Authenticate user and acc
  // TO DO 1.7: fix image layout Gallery/imageItems
  // TO DO 2.0: ensure data privacy
  // TO DO 3.0: Create circular svg

  constructor(props) {
    super(props)

    this.state = {
      loggedIn: false,
      imageItems: [],
      fileName: 'Choose file',
      memeHash: '',
      imageHashes: [],
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
            {/* ChainSafe ChainX SwiftLock Lockify */}
            <Navbar className="nav" expand="md">
              <NavbarBrand href="/"><Header subtitle="" /></NavbarBrand>
              <Nav className="mr-auto" navbar></Nav>
              <NavItem><NavLink className="mr-auto nav_btn" href="/"><BsHouse size="2em" /> </NavLink></NavItem>

              {(!JSON.parse(localStorage.getItem('state'))) ?
                <NavItem><NavLink className="nav_btn" href="/login"><BsUnlock size="2em" /></NavLink></NavItem>
                : ''}
              {(JSON.parse(localStorage.getItem('state'))) ?
                <NavItem><NavLink className="nav_btn" href="/gallery"><BsImages size="2em" /></NavLink></NavItem>
                : ''}
              {(JSON.parse(localStorage.getItem('state'))) ?
                <NavItem><NavLink className="nav_btn" href="/sharepoint"><BiShareAlt size="2em" /></NavLink></NavItem>
                : ''}
              {(JSON.parse(localStorage.getItem('state'))) ?
                <NavItem><NavLink className="nav_btn" onClick={() => {
                  localStorage.clear();
                }} href="/"><BsLock size="2em" /></NavLink></NavItem>
                : ''}

              {/* <NavItem><NavLink className="nav_btn" href="/sharepoint"><FontAwesomeIcon icon={faPaperPlane} size="2x" /></NavLink></NavItem> */}
            </Navbar>
            <Switch>
              <Route exact path='/' component={Root} />
              <Route path='/login' component={LogIn} />
              <Route path='/gallery' component={Gallery} />
              <Route path='/sharepoint' component={Sharepoint} />
              <Route path='/' component={Root} />
            </Switch>
          </main>
        </BrowserRouter>

        {/* see later carousel */}
        {/* <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Carousel views={images} onClickImage={this.toggleModal} />
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