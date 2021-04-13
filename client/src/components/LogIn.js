import React, { Component } from 'react';
import Web3 from "web3";
import CredentialStore from '../contracts/CredentialStore.json';
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
      newUser: false,
      allUsernames: [],
      showWarningUsernameExists: false,
      usernameContainsWhitespace: false,
    }
  }

  async componentDidMount() {
    await this.loadNetworkData()

    // Detects eth wallet account change 
    this.ethereum = window.ethereum
    if (this.ethereum) {
      this.ethereum.on('accountsChanged', function (accounts) {
        this.setState({ account: accounts[0] })
        localStorage.clear();

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
      const networkData = CredentialStore.networks[networkId]

      if (networkData) {
        const contract = new web3.eth.Contract(CredentialStore.abi, networkData.address)
        this.setState({ contract })

        let username;
        await contract.methods.getImages().call({ from: this.state.account }).then((r) => {
          username = r[2]
        }).catch((err) => {
          this.setState({ newUser: true })
        });

        // if user created an account
        if (username !== undefined) {
          this.setState({ acceptTerms: true })
          this.setState({ correctUsername: username })
          this.setState({ showWarningUsernameExists: false })
        }

        let allUsernames;
        await contract.methods.getUsernames().call({ from: this.state.account }).then((r) => {
          allUsernames = r
        }).catch((err) => {
          console.log(err);
        });

        if (allUsernames !== undefined) {
          this.setState({ allUsernames })
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
    if (this.state.correctUsername === "unregistered" || this.state.inputUsername === this.state.correctUsername) {
      this.setState({ wrongUsrname: false })

      if (!/\s/.test(this.state.inputUsername)) {
        this.setState({ usernameContainsWhitespace: false })

        if (this.state.acceptTerms) {
          this.setState({ showWarningNotAcceptedTerms: false })
          this.setState({ wrongUsrname: false })

          if (this.state.correctUsername !== "unregistered" || !this.state.allUsernames.find(usrnm => usrnm === this.state.inputUsername)) {
            this.setState({ showWarningUsernameExists: false })

            try {
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
          } else {
            this.setState({ showWarningUsernameExists: true })
            this.setState({ showWarningNotAcceptedTerms: false })
          }
        }
        else {
          this.setState({ showWarningNotAcceptedTerms: true })
          this.setState({ showWarningUsernameExists: false })
        }
      } else {
        this.setState({ usernameContainsWhitespace: true })
        this.setState({ showWarningNotAcceptedTerms: false })
        this.setState({ showWarningUsernameExists: false })
      }
    } else if (this.state.inputUsername !== this.state.correctUsername) {
      this.setState({ wrongUsrname: true })
      this.setState({ showWarningNotAcceptedTerms: false })
    }
  }

  handleOnChange = (event) => {
    this.setState({ inputUsername: event.target.value });
  }

  render() {
    return (
      <div className='login' id="login-data">
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto mt-5">
                {(!JSON.parse(localStorage.getItem('state'))) ? (

                  <div className="top_login_space">

                    <div className="h10">Connect your MetaMask account with just one click.</div>
                    {!this.state.newUser ? <h3 id="sign-label">Enter your username to login.</h3>
                      : <h3 id="login-label">Please follow the instructions on the <a href='/About' style={{color: '#6e967a', display:'inline'}} rel="noopener noreferrer">How To</a> page.<br></br> Enter your username to sign up.</h3>}

                    <form onSubmit={(e) => { this.onSignUp(e) }}>
                      <label>
                        <input id="input-usr" type="text" value={this.state.username} className="mt-5 container username_input" onChange={this.handleOnChange} size="20" placeholder="" maxLength="16" required />
                      </label>

                      <br></br>

                      {this.state.newUser &&
                        <div>
                          <input type="checkbox" id="agree" onChange={() => this.setState(state => ({ acceptTerms: !state.acceptTerms }))} />
                          <label htmlFor="agree" style={{ textIndent: '0.5em' }}><p> I agree to terms and conditions.*</p></label>
                        </div>}

                      {this.state.newUser && this.state.showWarningNotAcceptedTerms && <div id="terms-conditions" className="err">Please accept the terms and conditions to proceed.</div>}

                      {this.state.newUser && this.state.showWarningUsernameExists && <div id="username-exists" className="err">This username already exists, please choose a different one.</div>}

                      {(this.state.wrongUsrname || this.state.newUser) && this.state.usernameContainsWhitespace && <div id="no-spaces" className="err"> Username must be without whitespaces.</div>}

                      {this.state.wrongUsrname && <div id="wrong-login" className="err">Your login credentials could not be verified.</div>}

                      <br></br>

                      {this.state.newUser ? <button id="submit-btn" type='submit' value="Submit" className="btn mt-3 container log_in_btn">Sign Up</button>
                        : <button id="submit-btn" type='submit' value="Submit" className="btn mt-3 container log_in_btn">Login</button>}

                    </form>

                    {this.state.newUser &&
                      <div style={{ textIndent: '0.5em' }}>
                        <div className='footer_space'></div>
                        <p style={{ color: '#56755f' }}>* Click <a style={{ color: '#6e967a', textDecoration: 'underline' }} href='https://ethereum.org/en/terms-of-use/' target='_blank' rel="noopener noreferrer">
                          here</a> to read the terms of use (
                            <a style={{ color: '#6e967a', textDecoration: 'underline' }} href='https://metamask.io/terms.html' target='_blank' rel="noopener noreferrer">
                            Metamask</a> terms also apply).
                        </p>
                      </div>}
                  </div>

                ) : <h3 id="logged-in">You are already logged in.</h3>}
              </div>
            </main>
          </div>
        </div>
      </div>

    );
  }
}

export default withRouter(LogIn);