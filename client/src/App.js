import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Search from './components/Search';
import About from './components/About';
import Contact from './components/Contact';
import { BrowserRouter, Switch, Route } from 'react-router-dom' // Link
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'; // NavbarText
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearchPlus, faHome, faSignOutAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import ReadSum from "./components/ReadSum";
import SetSum from "./components/SetSum";

const Root = () => (
  <h2>Home</h2>
)

class App extends Component {

  // A way to initialise the state is to create a constructor
  constructor(props) {
    super(props);
    this.ethereum = window.ethereum
  }


  state = { loading: true, drizzleState: null };

  componentDidMount() {
    this.interval = setInterval(() => {
    this.connectToMetamask()}, 1000); 

    console.log('after repeatition');
    
    const { drizzle } = this.props;
    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {
    // every time the store updates, grab the state from drizzle
    const drizzleState = drizzle.store.getState();
    // check to see if it's ready, if so, update local component state
        if (drizzleState.drizzleStatus.initialized) {
          this.setState({ loading: false, drizzleState });
        }
    });
  }

  compomentWillUnmount() {
    clearInterval(this.interval);
    this.unsubscribe();
  }

  
  connectToMetamask = () => {
    // gets ethereum account - when reloads it receives new window.ethereum
    this.ethereum = window.ethereum

    if (this.ethereum) {
      // prompts the user to login with MM
      window.ethereum.enable(); // important: do not change window.eth
      console.log('Window: '+ window.ethereum.selectedAddress)

      this.ethereum.on('accountsChanged', function (accounts) {
        let accountAddress = accounts[0]
        console.log('ACOUNT CHANGED - new address: '+ accountAddress)

        // if (addr !== undefined) 
        // this.setState({ accountAddress: addr }) // when disconnecting setState is not a function
        window.location.reload();
      })
    }
  }

 


  render() {
    if (this.state.loading) return "Loading Drizzle...";
    return (
      <div className="App">
         
        <BrowserRouter>  
        <main>
          <Navbar className="nav" expand="md">
              <NavbarBrand href="/"><Header subtitle="Credential Store"/></NavbarBrand>
                <Nav className="mr-auto" navbar></Nav>
                <NavItem>
                  <NavLink className="mr-auto" href="/"><FontAwesomeIcon icon={faHome} style={{color:"#9AEDED"}} size="2x"/></NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/search/"><FontAwesomeIcon icon={faSearchPlus} style={{color:"#9AEDED"}} size="2x"/></NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/contact"><FontAwesomeIcon icon={faPaperPlane} style={{color:"#9AEDED"}} size="2x"/></NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/about"><FontAwesomeIcon icon={faSignOutAlt} style={{color:"#9AEDED"}} size="2x"/></NavLink>
                </NavItem>
            </Navbar>     
            <Switch>
                <Route exact path='/' component={Root} />
                <Route path='/search' component={Search} />
                <Route path='/about' component={About} />
                <Route path='/contact' component={Contact} />
            </Switch>
            </main> 
        </BrowserRouter>

      <div>

        <h1 className="App-title">Welcome to CS <br></br>(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</h1>
        {this.ethereum && <p>Your ethereum address: {this.ethereum.selectedAddress} </p>} {/* dfs{this.state.accountAddress} */}
        {!this.ethereum && <p style={{color: 'red'}}>Please use browser with Ethereum wallet (install MetaMask) </p>}


        <ReadSum drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />
        <SetSum drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}  />
  

    <br></br>
    1. Shrek<br></br>


      </div>
      </div>
    );
  }


}

export default App;