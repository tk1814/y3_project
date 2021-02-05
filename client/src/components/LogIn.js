import React, { Component } from 'react';
import Web3 from "web3";
import Meme from '../contracts/Meme.json';
// import LogInButton from './LogInButton';
import { withRouter } from 'react-router-dom';

class LogIn extends Component {

  constructor(props) {
    super(props)

    this.state = {
      imageItems: [],
      imageHashes: [],
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      inputUsername: '',
      correctUsername: "unregistered",
      wrongUsrname: false
    }
    // this.onSignUp = this.onSignUp.bind(this);
    // this.handleOnChange = this.handleOnChange.bind(this);

  }

  async componentWillMount() { // Lifecycle https://stackoverflow.com/questions/38814764/componentwillmount-is-called-twice
    await this.loadWeb3()
    await this.loadNetworkData()

    // Detects eth wallet account change 
    this.ethereum = window.ethereum
    if (this.ethereum) {
      // already happens from the other function // window.ethereum.enable(); // important: do not change window.eth
      console.log('Window: ' + window.ethereum.selectedAddress)

      this.ethereum.on('accountsChanged', function (accounts) {
        this.setState({ account: accounts[0] })
        localStorage.setItem('state', JSON.stringify(false));

        window.location.reload();
      }.bind(this))
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  // Load account
  async loadNetworkData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]

    if (networkData) {
      const contract = new web3.eth.Contract(Meme.abi, networkData.address)
      this.setState({ contract })
      // store and retrieve account address from localStorage
      // localStorage.setItem('account', JSON.stringify(accounts[0]));
      // const account_address = JSON.parse(localStorage.getItem('account'))

      let username;
      await contract.methods.get().call({ from: this.state.account }).then((r) => {
        username = r[2]
      }).catch((err) => {
        console.log("New user");
      });

      if (username !== undefined) {
        console.log(username)
        this.setState({ correctUsername: username })
      }
    }
    else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }


  redirectToGallery = () => {
    const { history } = this.props;
    if (history) history.push('/gallery');
  }

  onSignUp = async (event) => {
    event.preventDefault();

    // no whitespaces
    if ((this.state.correctUsername === "unregistered" || this.state.inputUsername === this.state.correctUsername) && !/\s/.test(this.state.inputUsername)) {
      this.setState({ wrongUsrname: false })

      try {
        // check username size dipls? 
        await this.state.contract.methods.signUpUserOrLogin(this.state.inputUsername).send({ from: this.state.account }).then((r) => {
          localStorage.setItem('state', JSON.stringify(true));

          this.redirectToGallery();
          window.location.reload();
        })
        event.preventDefault()
      } catch (e) {
        localStorage.setItem('state', JSON.stringify(false));
        console.log('Error logging in', e)
      }
    } else if (this.state.inputUsername !== this.state.correctUsername) { //this.state.inputUsername.indexOf(' ') >= 0 ||
      this.setState({ wrongUsrname: true })
    }

  }

  handleOnChange = (event) => {
    this.setState({ inputUsername: event.target.value });
  }

  render() {
    return (
      <div className='login'>
        {/* <h2>Log In</h2> */}
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto mt-5">
                {(!JSON.parse(localStorage.getItem('state'))) ? (

                  <div className="top_login_space">
                    <h3 className="mt-4">Connect your MetaMask account with only one click.<br></br> Enter your username to login.</h3>

                    <form onSubmit={(e) => { this.onSignUp(e) }}>
                      <label>
                        <input type="text" value={this.state.username} className="mt-5 container username_input" onChange={this.handleOnChange} size="20" placeholder=" " maxLength="16" required />
                      </label>
                      {this.state.wrongUsrname && <div className="err">Your login credentials could not be verified, please try again.</div>}
                      <br></br>

                      <button type='submit' value="Submit" className="btn mt-3 container log_in_btn">Login</button>
                    </form>

                    {/* <button type='submit' className="btn mt-5 container log_in_btn"
                                            onClick={(e) => { this.onSignUp(e) }}>Login</button> */}

                  </div>
                  // <LogInButton onSignUp={this.onSignUp}></LogInButton>

                ) : <h3>You are already logged in</h3>}
              </div>
            </main>
          </div>
        </div>
      </div>

    );
  }
}

export default withRouter(LogIn);