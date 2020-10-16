import React, { Component } from 'react';
import Web3 from "web3";
import Meme from '../contracts/Meme.json';
import LogInButton from './LogInButton';


class LogIn extends Component {

    constructor(props) {
        super(props)

        this.state = {
            imageItems: [],
            // fileName: 'Choose file',
            imageArr: [],
            contract: null,
            web3: null,
            buffer: null,
            account: null
        }
        // this.onSignUp = this.onSignUp.bind(this);
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
        }
        else {
            window.alert('Smart contract not deployed to detected network.')
        }
    }

    onSignUp = async (event) => {
        this.state.contract.methods.signUpUserOrLogin(this.state.account).send({ from: this.state.account }).then((r) => {
        }) // await 
        event.preventDefault()
    }

    render() {

        return (
            <div className='login'>
                <h2>Log In</h2>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto">
                                <LogInButton onSignUp={this.onSignUp}></LogInButton>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default LogIn;