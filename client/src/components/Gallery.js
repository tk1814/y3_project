import React, { Component } from 'react';
import bs58 from 'bs58';
import Web3 from "web3";
import Meme from '../contracts/Meme.json';
import { Modal, ModalGateway } from 'react-images';
// import EthCrypto, { publicKey } from 'eth-crypto';
// import Images from './Images';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: 'Choose an image',
      imageItems: [],
      imageHashes: [],
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      modalIsOpen: false,
      img_index: 0
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

        // ***LOGOUT WHEN ACCOUNT CHANGES***
        //   const dispatch = useDispatch();
        //   dispatch(loggedIn());
        // let isLogged = useSelector(state => state.isLogged);
        localStorage.setItem('state', JSON.stringify(false));

        window.location.reload();
      }.bind(this))
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. You should install MetaMask!')
    }
  }

  toggleModal(index) {
    this.setState(state => ({ modalIsOpen: !state.modalIsOpen }));
    this.setState({ img_index: index });
    // const {onChange, onClose, isModal, ...props} = this.props;
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
      // let imageSolArray = await contract.methods.get(this.state.account).call() // GETS

      let imageSolArray = await contract.methods.get().call({ from: this.state.account });
      // .then((r) => {  
      // })
      // console.log(imageSolArray)

      if (imageSolArray !== undefined) {
        // Did the hashes, imageHashes is ready to display
        let imageHashes = imageSolArray.slice();
        imageSolArray.forEach(function (item, index) {
          let hashHex = "1220" + item.slice(2)
          let hashBytes = Buffer.from(hashHex, 'hex');
          let hashStr = bs58.encode(hashBytes)
          imageHashes[index] = hashStr;
        });

        this.setState({ imageHashes: imageHashes })

        // IMAGE LAYOUT %%%%%%%%%%%%
        let imageItems
        imageItems = this.state.imageHashes.map((image, index) => (
          // if image != 0x00..
          //   <button onClick={(e) => this.deleteImg(e, index)}>DELETE</button>
          <img key={index} onClick={() => this.toggleModal(index)} className="mr-4 mb-3 mt-4 img_item" src={`https://ipfs.infura.io/ipfs/${image}`} alt="inputFile" />
        ))
        this.setState({ imageItems: imageItems })
      }


    }
    else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  // deleteImg(e, index) {
  //   console.log(index)
  //   let img_hashes = this.state.imageHashes.splice(index, 1);
  //   this.setState({ imageHashes: img_hashes });
  //   // await 
  //   this.state.contract.methods.deleteImage(this.state.account, index).send({ from: this.state.account }).then((r) => {
  //     window.location.reload();
  //   })
  //   console.log(this.state.imageHashes)
  // }

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

        // check if hash exists so the user does not pay to re-execute the contract
        if (this.state.imageHashes.find(img_itm => img_itm === file_hash)) {
          alert('This image already exists. Please select a different one.');
        } else {

          let hash_decoded = bs58.decode(file_hash).slice(2); // 32 to be stored.toString()

          console.log('aaaa ', hash_decoded)
          // // move when registering user
          // const alice = EthCrypto.createIdentity();

          // // const entropy = Buffer.from(window.ethereum.selectedAddress, 'utf-8'); // must contain at least 128 chars
          // // const identity = EthCrypto.createIdentity(entropy);
          // console.log('id ', alice.address);


          // const secretMessage = hash_decoded;
          // const encrypted = await EthCrypto.encryptWithPublicKey(
          //   alice.publicKey, // encrypt with alice's publicKey
          //   secretMessage
          // );
          // console.log('enc ', encrypted);

          // const decrypted = await EthCrypto.decryptWithPrivateKey(
          //   alice.privateKey,
          //   encrypted
          // );
          // console.log(decrypted);
          // if (decrypted === secretMessage) console.log('success');

          // let public_key = window.ethereum.selectedAddress.slice(2);
          // var privateKey = new Buffer(public_key, "hex");
          // const encrypted = await EthCrypto.encryptWithPublicKey(
          //   privateKey, // pk
          //   hash_decoded // message
          // ); 

          // this.state.account, hash_decoded
          await this.state.contract.methods.set(hash_decoded).send({ from: this.state.account }).then((r) => {
            // refresh to get the new image array with get() of smart contract
            window.location.reload();
          })
        }
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
      <div className="gallery_bg">
        {(JSON.parse(localStorage.getItem('state'))) ?
          <div>
            <div className="top_gallery_space">
              <h4>Hello [user]</h4>
              <h3 className="mt-4">Upload an image</h3>

              <div className="container-fluid mt-4">
                <div className="row">
                  <main role="main" className="col-lg-12 d-flex text-center">
                    <div className="content mr-auto ml-auto">

                      <form className="input-group mt-3" onSubmit={this.onSubmit} >
                        <input type="file" accept="image/*" onChange={this.captureFile} className="custom-file-input " /> {/* mx-sm-3 */}
                        <label className="custom-file-label ss">{this.state.fileName}</label>
                        <button type='submit' className="btn submit_btn mt-4 container">Submit</button>
                      </form>

                    </div>
                  </main>
                </div>
              </div>
              <div className="space"></div>
            </div>

            <div className="container-fluid">
              <div className="row">
                <main role="main" className="col-lg-12 d-flex text-center">
                  <div className="content mr-auto ml-auto">

                    {(this.state.imageHashes.length !== 0) ? (
                      <div>
                        <h4 className="mb-5">Your Gallery</h4>
                        {this.state.imageItems}

                        <ModalGateway>
                          {this.state.modalIsOpen ? (
                            <Modal onClose={() => this.toggleModal(this.state.img_index)}>
                              <div className="imgbox">
                                <img className="center_fit" src={`https://ipfs.infura.io/ipfs/${this.state.imageHashes[this.state.img_index]}`} alt="inputFile" />
                                {/* <p>{this.state.fileName}</p> */}
                              </div>
                            </Modal>) : ''}
                        </ModalGateway>
                      </div>) : <h3>No images to display, try uploading one.</h3>}

                    {/* <div className="smaller_space"></div> */}

                    <div className="footer_space"></div>
                  </div>
                </main>
              </div>
            </div>

          </div>
          : (<div className="top_gallery_space" >
            <h3>User not logged in to display images</h3>
          </div>)}
      </div >
    );
  }
}

export default Gallery;