import React, { Component } from 'react';
import bs58 from 'bs58';
import Web3 from "web3";
import Meme from '../contracts/Meme.json';
import Carousel, { Modal, ModalGateway } from 'react-images';
import ImagePicker from 'react-image-picker';
import { BsDownload } from "react-icons/bs";
import Select from 'react-select';
import { Table } from 'react-bootstrap';

class Sharepoint extends Component {

  constructor(props) {
    super(props);
    this.state = {
      usrname: '',
      items: [],
      imageHashesNotShared: [],
      imageHashesShared: [],
      image_links_to_be_shared: [],
      imageNameSolArray: [],
      imageNamesSharedSolArray: [],
      fileHashesNotShared: [],
      fileHashesShared: [],
      file_links_to_be_shared: [],
      fileNameSolArray: [],
      fileNamesSharedSolArray: [],
      addressSharedwithUserSolArray: [],
      usernameSharedWithUserSolArray: [],
      fileAddressSharedwithUserSolArray: [],
      fileUsernameSharedWithUserSolArray: [],
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      modalIsOpen: false,
      img_index: 0,
      image_shared_src: [],
      file_shared_src: []
    }
    this.onShare = this.onShare.bind(this);
  }

  redirectToLogin = () => {
    const { history } = this.props;
    if (history) history.push('/login');
  }

  async componentWillMount() {
    await this.loadBlockchainData()

    // Detects eth wallet account change 
    this.ethereum = window.ethereum
    if (this.ethereum) {
      console.log('Window: ' + window.ethereum.selectedAddress)

      this.ethereum.on('accountsChanged', function (accounts) {
        this.setState({ account: accounts[0] })
        localStorage.setItem('state', JSON.stringify(false));

        this.redirectToLogin();
        window.location.reload();
      }.bind(this))
    }
  }


  async loadBlockchainData() {

    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      this.setState({ account: accounts[0] })
      const networkId = await web3.eth.net.getId()
      const networkData = Meme.networks[networkId]

      if (networkData) {
        const contract = new web3.eth.Contract(Meme.abi, networkData.address)
        this.setState({ contract })

        let imageSolArray, imageNameSolArray, usrname;
        await contract.methods.get().call({ from: this.state.account }).then((r) => {
          imageSolArray = r[0]
          imageNameSolArray = r[1]
          usrname = r[2]
        })

        if (usrname !== undefined) {
          this.setState({ usrname })
        }

        if (imageNameSolArray !== undefined) {
          this.setState({ imageNameSolArray: imageNameSolArray })
        }

        if (imageSolArray !== undefined) {
          let imageHashes = imageSolArray.slice();
          imageSolArray.forEach(function (item, index) {
            let hashHex = "1220" + item.slice(2)
            let hashBytes = Buffer.from(hashHex, 'hex')
            let hashStr = bs58.encode(hashBytes)
            imageHashes[index] = hashStr
          });

          // this.setState({ imageHashes: imageHashes })
          this.setState({ imageHashesNotShared: imageHashes })
        }


        // LOAD Shared images array
        let imageSharedSolArray, imageNamesSharedSolArray, addressSharedwithUserSolArray, usernameSharedWithUserSolArray;
        await contract.methods.getSharedImageArr().call({ from: this.state.account }).then((r) => {
          imageSharedSolArray = r[0]
          imageNamesSharedSolArray = r[1]
          addressSharedwithUserSolArray = r[2]
          usernameSharedWithUserSolArray = r[3]

          if (imageSharedSolArray !== undefined && imageNamesSharedSolArray !== undefined && addressSharedwithUserSolArray !== undefined
            && usernameSharedWithUserSolArray !== undefined) {
            let imageHashesShared = imageSharedSolArray.slice()
            imageSharedSolArray.forEach(function (item, index) {
              let hashHex = "1220" + item.slice(2)
              let hashBytes = Buffer.from(hashHex, 'hex');
              let hashStr = bs58.encode(hashBytes)
              imageHashesShared[index] = hashStr
            });

            this.setState({ imageHashesShared: imageHashesShared })
            this.setState({ imageNamesSharedSolArray: imageNamesSharedSolArray })
            this.setState({ addressSharedwithUserSolArray: addressSharedwithUserSolArray })
            this.setState({ usernameSharedWithUserSolArray: usernameSharedWithUserSolArray })

            // IMAGE LAYOUT %%%%%%%%%%%%
            let imageHashesSharedItems
            imageHashesSharedItems = this.state.imageHashesShared.map((image, index) => (
              <img key={index} onClick={() => this.toggleModal(index)} className="mr-4 mb-3 mt-4 img_item" src={`https://ipfs.infura.io/ipfs/${image}`} alt="inputFile" />
            ))
            this.setState({ imageHashesSharedItems: imageHashesSharedItems })

            let image_shared_src = [];
            let hashes = this.state.imageHashesShared.map((image, index) =>
              `https://ipfs.infura.io/ipfs/${image}`)

            for (let i = 0; i < hashes.length; i++) {
              image_shared_src.push({ source: hashes[i] })
            }
            this.setState({ image_shared_src: image_shared_src })

          }
        });

        // FILE GET REQUEST %%%%%%%%%%%%%%%%%%%%%% GET MY UPLOADED FILES (IF ANY)
        let fileSolArray, fileNameSolArray;
        await contract.methods.getFile().call({ from: this.state.account }).then((r) => {
          fileSolArray = r[0]
          fileNameSolArray = r[1]
        })

        if (fileNameSolArray !== undefined) {
          this.setState({ fileNameSolArray: fileNameSolArray })
        }

        if (fileSolArray !== undefined) {
          let fileHashes = fileSolArray.slice();
          fileSolArray.forEach(function (item, index) {
            let hashHex = "1220" + item.slice(2)
            let hashBytes = Buffer.from(hashHex, 'hex')
            let hashStr = bs58.encode(hashBytes)
            fileHashes[index] = hashStr
          });

          this.setState({ fileHashesNotShared: fileHashes })
        }

        // LOAD Shared files array %%%%%%%%%%%%%%%%%%%%%%% GET THE FILES THAT WERE SHARED WITH ME
        let fileSharedSolArray, fileNamesSharedSolArray, fileAddressSharedwithUserSolArray, fileUsernameSharedWithUserSolArray;
        await contract.methods.getSharedFileArr().call({ from: this.state.account }).then((r) => {
          fileSharedSolArray = r[0]
          fileNamesSharedSolArray = r[1]
          fileAddressSharedwithUserSolArray = r[2]
          fileUsernameSharedWithUserSolArray = r[3]

          if (fileSharedSolArray !== undefined && fileNamesSharedSolArray !== undefined && fileAddressSharedwithUserSolArray !== undefined
            && fileUsernameSharedWithUserSolArray !== undefined) {
            let fileHashesShared = fileSharedSolArray.slice()
            fileSharedSolArray.forEach(function (item, index) {
              let hashHex = "1220" + item.slice(2)
              let hashBytes = Buffer.from(hashHex, 'hex');
              let hashStr = bs58.encode(hashBytes)
              fileHashesShared[index] = hashStr
            });

            this.setState({ fileHashesShared: fileHashesShared })
            this.setState({ fileNamesSharedSolArray: fileNamesSharedSolArray })
            this.setState({ fileAddressSharedwithUserSolArray: fileAddressSharedwithUserSolArray })
            this.setState({ fileUsernameSharedWithUserSolArray: fileUsernameSharedWithUserSolArray })



            let fileHashesSharedItems;
            fileHashesSharedItems = this.state.fileHashesShared.map((file, index) => (
              <div>
                {/* <a href={`https://ipfs.infura.io/ipfs/${file}`} target="_blank">{Web3.utils.hexToAscii(this.state.fileNameSolArray[index])}</a> */}
                {/* <h5 className="mt-2"> From: {this.state.fileUsernameSharedWithUserSolArray[index]} </h5> */}
                {/* <h5 className="mb-2"> Shared by: {this.state.fileAddressSharedwithUserSolArray[index]} </h5> */}
              </div>
            ))
            this.setState({ fileHashesSharedItems: fileHashesSharedItems })

            let file_shared_src = [];
            let hashes = this.state.fileHashesShared.map((file, index) =>
              `https://ipfs.infura.io/ipfs/${file}`)

            for (let i = 0; i < hashes.length; i++) {
              file_shared_src.push({ source: hashes[i] })
            }
            this.setState({ file_shared_src: file_shared_src })

            // SHARED FILES ITEMS
            const items = [];
            for (let i = 0; i < file_shared_src.length; i++) {
              items.push({ id: i, Name: Web3.utils.hexToAscii(this.state.fileNamesSharedSolArray[i]), File: this.state.file_shared_src[i].source, From: this.state.fileUsernameSharedWithUserSolArray[i], Address: this.state.fileAddressSharedwithUserSolArray[i] });
            }
            this.setState({ items })
            console.log(items)
          }
        });


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

  toggleModal(index) {
    this.setState(state => ({ modalIsOpen: !state.modalIsOpen }));
    this.setState({ img_index: index });
    // const {onChange, onClose, isModal, ...props} = this.props;
  }

  onShare = async (e) => {

    let input_address = this.inputAddress.value
    let current_address = this.state.account
    try {
      if (this.state.image_links_to_be_shared.length === 0) {
        alert('No image was selected to share. Please select an image first.')
      } else if (!input_address) {
        alert('No public address was entered. Please enter a public address.')
      } else if (this.state.image_links_to_be_shared.length === 0) {
        alert('No image was selected to share. Please select an image first.')
      } else if (input_address.toLowerCase() === current_address.toLowerCase()) {
        alert('Cannot share images with yourself')
      } else {

        let image_hash = this.state.image_links_to_be_shared.src.slice(28);
        let img_hash_decoded = bs58.decode(image_hash).slice(2);
        let hex_filename = this.state.imageNameSolArray[this.state.image_links_to_be_shared.value]

        await this.state.contract.methods.shareImage(this.state.usrname, input_address, img_hash_decoded, hex_filename).send({ from: this.state.account }).then((r) => {
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

  onShareFile = async (e) => {

    let input_address = this.inputAddressFile.value
    let current_address = this.state.account
    try {
      if (this.state.file_links_to_be_shared.length === 0) {
        alert('No file was selected to share. Please select a file first.')
      } else if (!input_address) {
        alert('No public address was entered. Please enter a public address.')
      }
      // else if (this.state.file_links_to_be_shared.length === 0) {
      //   alert('No file was selected to share. Please select a file first.')
      // } 
      else if (input_address.toLowerCase() === current_address.toLowerCase()) {
        alert('Cannot share files with yourself')
      } 
      else {

        let file_hash = this.state.file_links_to_be_shared.value.slice(28);
        let file_hash_decoded = bs58.decode(file_hash).slice(2);
        let hex_filename = this.state.fileNameSolArray[this.state.file_links_to_be_shared.idx]

        await this.state.contract.methods.shareFile(this.state.usrname, input_address, file_hash_decoded, hex_filename).send({ from: this.state.account }).then((r) => {
          window.location.reload();
        })

        // empty the array to check whether files were selected next time
        this.setState({ file_links_to_be_shared: [] })
      }

    } catch (e) {
      console.log(e);
      alert("Invalid public address entered or request was rejected.")
    }
  }

  onPickImages(images) {
    this.setState({ image_links_to_be_shared: images })
    // console.log(images.value)
  }

  handleChange = (file_links_to_be_shared) => {
    this.setState({ file_links_to_be_shared });
    // console.log(`Option selected:`, file_links_to_be_shared.value);
  };

  captionImg = (idx) => {
    return (
      <div>
        <h5 className="mt-2"> {Web3.utils.hexToAscii(this.state.imageNamesSharedSolArray[idx.currentIndex])} | From: {this.state.usernameSharedWithUserSolArray[idx.currentIndex]} </h5>
        <h5 className="mb-2"> Shared by: {this.state.addressSharedwithUserSolArray[idx.currentIndex]} </h5>
      </div>
    )
  }

  downloadImage = (img) => {
    fetch(img, {
      method: "GET",
      headers: {}
    }).then(response => {
      response.arrayBuffer().then(function (buffer) {
        const url = window.URL.createObjectURL(new Blob([buffer]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "image.png");
        document.body.appendChild(link);
        link.click();
      });
    }).catch(err => {
      console.log(err);
    });
  }


  customFooter = ({ isModal, currentView }) => isModal && (
    <div className="react-images__footer">
      <button className="btn btn_download" style={{ outline: "none" }} type="button" onClick={() => { this.downloadImage(currentView.source); }}><BsDownload size="1.8em" /></button>
    </div>
  );

  renderItem(item, index) {
    return (
      <tr key={index}>
        <td>{item.id}</td>
        <td><a href={item.File} target="_blank" rel="noopener noreferrer" style={{ color: '#80C2AF' }}>{item.Name}</a></td>
        <td>{item.From}</td>
        <td>{item.Address}</td>
      </tr>
    )
  }; //////// IF ALREADY SHARED IT DOES NOT PUT IN THE MEME ARRAY

  render() {

    const { file_links_to_be_shared } = this.state;
    return (
      <div className="simple_bg ">

        {(JSON.parse(localStorage.getItem('state'))) ?

          <div className="container-fluid">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">

                  {/* <ModalGateway>
                    {this.state.modalIsOpen ? (
                      <Modal onClose={() => this.toggleModal(this.state.img_index)}>
                        <div className="imgbox">
                          <img className="center_fit mb-1" src={`https://ipfs.infura.io/ipfs/${this.state.imageHashesShared[this.state.img_index]}`} alt="inputFile" />
                          <div className="img_caption">
                            <h5 className="mt-2"> Image: {Web3.utils.hexToAscii(this.state.imageNamesSharedSolArray[this.state.img_index])} </h5>
                            <h5 className="mb-2"> Shared by: {this.state.addressSharedwithUserSolArray[this.state.img_index]}</h5>
                          </div>
                        </div>
                      </Modal>) : ''}
                  </ModalGateway> */}

                  <ModalGateway>
                    {this.state.modalIsOpen ? (
                      <Modal onClose={() => this.toggleModal(this.state.img_index)}>

                        <Carousel
                          components={{ FooterCaption: this.captionImg.bind(this), FooterCount: this.customFooter.bind(this) }}
                          currentIndex={this.state.img_index}
                          views={this.state.image_shared_src}
                          styles={{
                            container: base => ({
                              ...base,
                              height: '100vh',
                            }),
                            view: base => ({
                              ...base,
                              alignItems: 'center',
                              display: 'flex ',
                              height: 'calc(100vh - 54px)',
                              justifyContent: 'center',

                              '& > img': {
                                maxHeight: 'calc(100vh - 94px)',
                              },
                            })

                          }}
                        />
                      </Modal>
                    ) : ''}
                  </ModalGateway>

                  <div className="smaller_space"></div>

                  {(this.state.imageHashesNotShared.length !== 0) ? (
                    // {(this.state.imageHashesNotShared) ? (
                    <div>
                      <h4 className="mb-5">Select an image to share</h4>
                      <ImagePicker className="image_picker"
                        images={this.state.imageHashesNotShared.map((image, index) => ({ src: `https://ipfs.infura.io/ipfs/${image}`, value: index }))}
                        onPick={this.onPickImages.bind(this)} /> {/* multiple /> */}

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




                  {(this.state.fileHashesNotShared.length !== 0) ? (
                    <div className="top_login_space">
                      <br></br>
                      <h4 className="mb-5">Select a file to share</h4>

                      <Select className="file_picker mb-4"
                        value={file_links_to_be_shared}
                        onChange={this.handleChange}
                        options={this.state.fileHashesNotShared.map((file, index) => ({
                          value: `https://ipfs.infura.io/ipfs/${file}`,
                          label: Web3.utils.hexToAscii(this.state.fileNameSolArray[index]),
                          idx: index
                        }))} />

                      <br></br>
                      <div className="row">
                        <div className="content mr-auto ml-auto">
                          <div className="input-group mb-3 mt-5">
                            <div className="input-group-prepend">
                              <button className="btn_left_border" type="submit" onClick={(e) => this.onShareFile(e)}>Share file with:</button>
                            </div>
                            <input type="text" ref={address_inputFile => (this.inputAddressFile = address_inputFile)} className="form-control input_right_border shadow-none" placeholder="Enter public address" size="50" maxLength="42" required />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : <h3>No available fles to be shared. Try uploading a file.</h3>}

                  <br></br>

                  {(this.state.fileHashesShared.length !== 0) ? (
                    <div>
                      <h4 className="mt-5 mb-5">Files shared with you</h4>

                      <Table striped bordered hover variant="dark" className="table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>File</th>
                            <th>From</th>
                            <th>Address</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.items.map(this.renderItem)}
                        </tbody>
                      </Table>

                    </div>
                  ) : <h3>No files shared with you.</h3>}


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