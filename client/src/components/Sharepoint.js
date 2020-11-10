import React, { Component } from 'react';
import bs58 from 'bs58';
import Web3 from "web3";
import Meme from '../contracts/Meme.json';
import { Modal, ModalGateway } from 'react-images';
import ImagePicker from 'react-image-picker';

class Sharepoint extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imageHashesNotShared: [],
      imageHashesShared: [],
      image_links_to_be_shared: [],
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      modalIsOpen: false,
      img_index: 0
    }
    this.onShare = this.onShare.bind(this);
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

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Meme.networks[networkId]

    if (networkData) {
      const contract = new web3.eth.Contract(Meme.abi, networkData.address)
      this.setState({ contract })

      let imageSolArray = await contract.methods.get().call({ from: this.state.account });
      // .then((r) => {  
      // })
      // console.log(imageSolArray)

      if (imageSolArray !== undefined) {
        let imageHashes = imageSolArray.slice();
        imageSolArray.forEach(function (item, index) {
          let hashHex = "1220" + item.slice(2)
          let hashBytes = Buffer.from(hashHex, 'hex');
          let hashStr = bs58.encode(hashBytes)
          imageHashes[index] = hashStr;
        });

        // this.setState({ imageHashes: imageHashes })
        this.setState({ imageHashesNotShared: imageHashes })
      }


      // LOAD Shared images array
      let imageSharedSolArray = await contract.methods.getSharedImageArr().call({ from: this.state.account });
      if (imageSharedSolArray !== undefined) {
        let imageHashesShared = imageSharedSolArray.slice();
        imageSharedSolArray.forEach(function (item, index) {
          let hashHex = "1220" + item.slice(2)
          let hashBytes = Buffer.from(hashHex, 'hex');
          let hashStr = bs58.encode(hashBytes)
          imageHashesShared[index] = hashStr;
        });

        this.setState({ imageHashesShared: imageHashesShared })

        // IMAGE LAYOUT %%%%%%%%%%%%
        let imageHashesSharedItems
        imageHashesSharedItems = this.state.imageHashesShared.map((image, index) => (
          <img key={index} onClick={() => this.toggleModal(index)} className="mr-4 mb-3 mt-4 img_item" src={`https://ipfs.infura.io/ipfs/${image}`} alt="inputFile" />
        ))
        this.setState({ imageHashesSharedItems: imageHashesSharedItems })
      }

    }
    else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  toggleModal(index) {
    this.setState(state => ({ modalIsOpen: !state.modalIsOpen }));
    this.setState({ img_index: index });
    // const {onChange, onClose, isModal, ...props} = this.props;
  }

  onShare = async (e) => {

    // 2 0x7Fd3F76eE91BA9021a132e6D1c38BF7Eaa6aa60A
    // 3 0x5b0A292FEbc3fAdf035A6A395686f5190a44f2E5

    let input_address = this.inputAddress.value
    let current_address = this.state.account//await window.ethereum.selectedAddress
    try {
      if (this.state.image_links_to_be_shared.length === 0) {
        alert('No image was selected to share. Please select an image first.');
      } else if (!input_address) {
        alert('No public address was entered. Please enter a public address.');
      } else if (this.state.image_links_to_be_shared.length === 0) {
        alert('No image was selected to share. Please select an image first.');
      } else if (input_address.toLowerCase() === current_address.toLowerCase()) {
        alert('Cannot share images with yourself');
      } else {

        let image_hash = this.state.image_links_to_be_shared.src.slice(28);
        let img_hash_decoded = bs58.decode(image_hash).slice(2);

        await this.state.contract.methods.shareImage(input_address, img_hash_decoded).send({ from: this.state.account }).then((r) => {
          window.location.reload();
        })

        // empty the array to check whether images were selected next time
        this.setState({ image_links_to_be_shared: [] })
      }

    } catch (e) {
      console.log(e);
      alert("Wrong public address entered or request was rejected.")
    }
  }

  onPickImages(images) {
    this.setState({ image_links_to_be_shared: images })
    //console.log(images)
  }

  render() {
    return (
      <div className="simple_bg ">

        {(JSON.parse(localStorage.getItem('state'))) ?

          <div className="container-fluid">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">

                  <ModalGateway>
                    {this.state.modalIsOpen ? (
                      <Modal onClose={() => this.toggleModal(this.state.img_index)}>
                        <div className="imgbox">
                          <img className="center_fit" src={`https://ipfs.infura.io/ipfs/${this.state.imageHashesShared[this.state.img_index]}`} alt="inputFile" />
                        </div>
                      </Modal>) : ''}
                  </ModalGateway>

                  <div className="smaller_space"></div>

                  {(this.state.imageHashesNotShared.length !== 0) ? (
                    <div>
                      <h4 className="mb-5">Select an image to share</h4>
                      <ImagePicker className="image_picker"
                        images={this.state.imageHashesNotShared.map((image, index) => ({ src: `https://ipfs.infura.io/ipfs/${image}`, value: index }))}
                        onPick={this.onPickImages.bind(this)} /> {/* multiple />  */}

                      <div className="row">
                        <div className="content mr-auto ml-auto">
                          <div className="input-group mb-3 mt-5">
                            <div className="input-group-prepend">
                              <button className="btn btn_left_border" type="submit" onClick={(e) => this.onShare(e)}>Share image with:</button>
                            </div>
                            <input type="text" ref={address_input => (this.inputAddress = address_input)} className="form-control input_right_border shadow-none" placeholder="Enter public address" size="50" maxLength="42" required />
                          </div>
                        </div>
                      </div>
                    </div>) : <h3>No available images to be shared. Try uploading an image.</h3>}

                  <br></br>

                  {(this.state.imageHashesShared.length !== 0) ? (
                    <div>
                      <h4 className="mt-5">Images shared with you</h4>
                      {this.state.imageHashesSharedItems}
                    </div>
                  ) : <h3>No images shared with you.</h3>}

                  <div className="footer_space"></div>
                </div>
              </main>
            </div>
          </div> : <div><br></br><h3>User not logged in.</h3></div>}
      </div>
    );
  }
}

export default Sharepoint;