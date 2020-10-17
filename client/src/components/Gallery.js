import React, { Component } from 'react';
import bs58 from 'bs58';
import Images from './Images';
import Web3 from "web3";
import Meme from '../contracts/Meme.json';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: 'Choose a file',
      imageItems: [],
      imageArr: [],
      contract: null,
      web3: null,
      buffer: null,
      account: null
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()

    // Detects eth wallet account change 
    this.ethereum = window.ethereum
    if (this.ethereum) {
      console.log('Window: ' + window.ethereum.selectedAddress)

      this.ethereum.on('accountsChanged', function (accounts) {
        this.setState({ account: accounts[0] })

        // ****LOGOUT WHEN ACCOUNT CHANGES***
        //   const dispatch = useDispatch();
        //   dispatch(loggedIn());
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

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]

    if (networkData) {
      const contract = new web3.eth.Contract(Meme.abi, networkData.address)
      this.setState({ contract })

      // ----Minimise repetition btn Gallery and LogIn
      // ----SAVE IMGS IN LCSTORAGE so nn to get?
      // ----mby call loadWeb3 from LogIn.js
      let imageSolArray = await contract.methods.get(this.state.account).call() // GETS
      console.log(imageSolArray)

      if (imageSolArray !== undefined) {
        // Did the hashes, imageArr is ready to display
        let imageHashes = imageSolArray.slice();
        imageSolArray.forEach(function (item, index) {
          let hashHex = "1220" + item.slice(2)
          let hashBytes = Buffer.from(hashHex, 'hex');
          let hashStr = bs58.encode(hashBytes)
          imageHashes[index] = hashStr;
        });

        this.setState({ imageArr: imageHashes })

        let imageItems
        imageItems = this.state.imageArr.map((image, index) => (
          <img key={index} className="mr-3" style={{ height: "200px", width: "300px" }} src={`https://ipfs.infura.io/ipfs/${image}`} alt="inputFile" />
        ))
        this.setState({ imageItems: imageItems })
      }

    }
    else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  // Called whenever a file is uploaded, converts it to appropriate format for IPFS
  // stores the file in this component's state
  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]     // access file from user input
    const fileName = event.target.files[0].name;
    this.setState({ fileName: fileName })
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    // after reader finishes, initialise buffer and store in component state
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  // uploads the buffer file stored in state to IPFS using ipfs API
  // store the IPFS hash in the smart contract
  onSubmit = async (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")

    let buffer_data = this.state.buffer
    if (buffer_data) {
      try {
        const file = await ipfs.add(this.state.buffer)
        let file_hash = file.path //https://gateway.ipfs.io/ipfs/QmUaEA7Yt8Nx824hbkAHhABDWULnGcuKiXC7AECGkzMY72 //46

        let hash_decoded = bs58.decode(file_hash).slice(2);
        // console.log('Bytes32/store: ' + hash_decoded.toString('hex')) // 32 length

        this.state.contract.methods.set(this.state.account, hash_decoded).send({ from: this.state.account }).then((r) => {
          // refresh the page to get the new image array with get() of smart contract
          window.location.reload();
        })

      } catch (e) {
        console.log("Error: ", e)
      }
    } else {
      alert("No file was submitted. Please try again.")
      console.log('ERROR: No data to submit')
    }
  }

  render() {
    return (
      <div className="general_bg">
        {(JSON.parse(localStorage.getItem('state'))) ?
          <div>
            <br></br>
            <h2>Hello [User]</h2>
            <h2 className="mt-3">Upload an image</h2>

            <div className="container-fluid mt-5">
              <div className="row">
                <main role="main" className="col-lg-12 d-flex text-center">
                  <div className="content mr-auto ml-auto">

                    <form className="input-group mt-3" onSubmit={this.onSubmit} >
                      <input type="file" accept="image/*" onChange={this.captureFile} className="custom-file-input " /> {/* mx-sm-3 */}
                      <label className="custom-file-label">{this.state.fileName}</label>
                      <button type='submit' style={{ backgroundColor: "#6e967a", color: "#fff", fontSize: "1.5em" }} className="btn mt-4 container">Submit</button>
                    </form>

                  </div>
                </main>
              </div>
            </div>
            <div className="space"></div>
          </div>
          : ''}
        {/* <p>&nbsp;</p> */}

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h2 className="mb-5">Gallery</h2>
                <Images imageItems={this.state.imageItems}></Images>
                <div className="footer_space"></div>
              </div>
            </main>
          </div>
        </div>

      </div>
    );
  }
}

export default Gallery;