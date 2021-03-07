import React, { Component } from 'react';
import Web3 from "web3";
import Meme from '../contracts/Meme.json';
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
      wrongUsrname: false,
      acceptTerms: false,
      showWarningNotAcceptedTerms: false,
      newUser: false
    }
    // this.onSignUp = this.onSignUp.bind(this);
    // this.handleOnChange = this.handleOnChange.bind(this);
  }

  async componentDidMount() { 
    await this.loadNetworkData()

    // Detects eth wallet account change 
    this.ethereum = window.ethereum
    if (this.ethereum) {
      // already happens from the other function // window.ethereum.enable(); // important: do not change window.eth
      console.log('Window: ' + window.ethereum.selectedAddress)

      this.ethereum.on('accountsChanged', function (accounts) {
        this.setState({ account: accounts[0] })
        localStorage.setItem('state', JSON.stringify(false));
        localStorage.setItem('item', JSON.stringify(''));
        localStorage.setItem('address', JSON.stringify(''));

        window.location.reload();
      }.bind(this))
    }
  }

  // Load account
  async loadNetworkData() {

    if (typeof window.ethereum !== 'undefined') {

      const web3 = new Web3(window.ethereum)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      this.setState({ account: accounts[0] })
      const networkId = await web3.eth.net.getId()
      const networkData = Meme.networks[networkId]

      if (networkData) {
        const contract = new web3.eth.Contract(Meme.abi, networkData.address)
        this.setState({ contract })

        let username;
        await contract.methods.get().call({ from: this.state.account }).then((r) => {
          username = r[2]
        }).catch((err) => {
          console.log("New user");
          this.setState({newUser: true})
        });

        // if user created an account
        if (username !== undefined) {
          console.log(username)
          this.setState({ acceptTerms: true })
          this.setState({ correctUsername: username })
        }
      }
      else {
        window.alert('Smart contract not deployed to detected network.')
      }
    } else {
      // return to homepage if MetaMask is not installed
      window.alert('Non-Ethereum browser detected. You should install MetaMask!')
      const { history } = this.props;
      if (history) history.push('/');
    }
  }

  redirectToGallery = () => {
    const { history } = this.props;
    if (history) history.push('/gallery');
  }

  onSignUp = async (event) => {
    event.preventDefault();

    // if user not registered OR put correct username AND without whitespaces
    if ((this.state.correctUsername === "unregistered" || this.state.inputUsername === this.state.correctUsername) && !/\s/.test(this.state.inputUsername)) {
      this.setState({ wrongUsrname: false })

      if (this.state.acceptTerms) {
        this.setState({ showWarningNotAcceptedTerms: false })
        this.setState({ wrongUsrname: false })
        try {
          // check username size dupls? 
          await this.state.contract.methods.signUpUserOrLogin(this.state.inputUsername, 'Accepted Terms and Conditions: ' + Date().toLocaleString()).send({ from: this.state.account }).then((r) => {
            localStorage.setItem('state', JSON.stringify(true));

            this.redirectToGallery();
            window.location.reload();
          })
          event.preventDefault()
        } catch (e) {
          localStorage.setItem('state', JSON.stringify(false));
          console.log('Error logging in', e)
        }
      }
      else {
        this.setState({ showWarningNotAcceptedTerms: true })
      }

    } else if (this.state.inputUsername !== this.state.correctUsername) { //this.state.inputUsername.indexOf(' ') >= 0 ||
      this.setState({ wrongUsrname: true })
      this.setState({ showWarningNotAcceptedTerms: false })
    }
  }

  handleOnChange = (event) => {
    this.setState({ inputUsername: event.target.value });
  }

  render() {
    return (
      <div className='login'>
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

                      <br></br>

                      {this.state.newUser &&
                      <div>
                      <input type="checkbox" id="agree" onChange={() => this.setState(state => ({ acceptTerms: !state.acceptTerms }))} />
                      <label htmlFor="agree" style={{textIndent: '0.5em'}}><p> I agree to terms and conditions.*</p></label>
                      </div>}
                      
                      {this.state.newUser && this.state.showWarningNotAcceptedTerms && <div className="err">You have not accepted terms and conditions, please accept to proceed.</div>}

                      {this.state.wrongUsrname && <div className="err">Your login credentials could not be verified. <br></br> Or check that the username is without whitespaces.</div>}
                      <br></br>

                      <button type='submit' value="Submit" className="btn mt-3 container log_in_btn">Login</button>
                    </form>

                    {/* <button type='submit' className="btn mt-5 container log_in_btn"
                                            onClick={(e) => { this.onSignUp(e) }}>Login</button> */}

                  </div>

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