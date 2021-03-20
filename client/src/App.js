import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import LogIn from './components/LogIn';
import Gallery from './components/Gallery';
import Sharepoint from './components/Sharepoint';
import About from './components/About';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { BsHouse, BsLock, BsUnlock, BsFolder, BsQuestion } from "react-icons/bs";
import { BiShareAlt } from "react-icons/bi";
import PdfViewer from './components/PdfViewer';

const Root = () => (
  <div className="general_bg">
    <div className="top_space">
      <h4>Simpler Safer Faster</h4>
      <h3 className="mt-4">Storing files on Ethereum has never been easier.</h3>
      {(JSON.parse(localStorage.getItem('state'))) ?
        <a id="start-btn" href="/gallery" className="btn start_btn mt-5" role="button">Get Started</a>
        : <a id="start-btn" href="/login" className="btn start_btn mt-5" role="button">Get Started</a>}
    </div>
  </div>
);

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: null
    }
  }

  async componentDidMount() {

    // Detects metamask eth wallet account change 
    this.ethereum = window.ethereum
    if (this.ethereum) {
      this.ethereum.on('accountsChanged', function (accounts) {
        this.setState({ account: accounts[0] })
        localStorage.clear();
        window.location.reload();
      }.bind(this))
    }
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <main>
            <Navbar id="navbar" className="nav" expand="md">
              <NavbarBrand href="/"><Header subtitle="" /></NavbarBrand>
              <Nav className="mr-auto" navbar></Nav>
              <NavItem><NavLink className="mr-auto nav_btn" href="/"><BsHouse size="2em" /> </NavLink></NavItem>

              {(!JSON.parse(localStorage.getItem('state'))) ?
                <NavItem><NavLink id='login' className="nav_btn" href="/login"><BsUnlock size="2em" /></NavLink></NavItem>
                : ''}
              {(JSON.parse(localStorage.getItem('state'))) ?
                <NavItem><NavLink id="nav-gallery" className="nav_btn" href="/gallery"><BsFolder size="2em" /></NavLink></NavItem>
                : ''}
              {(JSON.parse(localStorage.getItem('state'))) ?
                <NavItem><NavLink id="nav-sharepoint" className="nav_btn" href="/sharepoint"><BiShareAlt size="2em" /></NavLink></NavItem>
                : ''}
              <NavItem><NavLink id="nav-about" className="nav_btn" href="/about"><BsQuestion size="2.2em" /></NavLink></NavItem>
              {(JSON.parse(localStorage.getItem('state'))) ?
                <NavItem><NavLink id='logout' className="nav_btn" onClick={() => {
                  localStorage.clear();
                }} href="/"><BsLock size="2em" /></NavLink></NavItem>
                : ''}
            </Navbar>
            <Switch>
              <Route exact path='/' component={Root} />
              <Route path='/login' component={LogIn} />
              <Route path='/gallery' component={Gallery} />
              <Route path='/about' component={About} />
              <Route path='/PdfViewer' component={PdfViewer} />
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