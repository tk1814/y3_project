import React, { Component } from 'react';
import bs58 from 'bs58';
import Web3 from "web3";
import Meme from '../contracts/Meme.json';
import Carousel, { Modal, ModalGateway } from 'react-images';
import { BiDownload } from "react-icons/bi"; 
import { RiUserShared2Line } from "react-icons/ri"; 
import moment from "moment"
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      fileName: 'Choose an image',
      imageItems: [],
      imageHashes: [],
      imageNameSolArray: [],
      fileItems: [],
      fileHashes: [],
      fileNameSolArray: [],
      dateUploadImg: [],
      dateUploadFile: [],
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      modalIsOpen: false,
      img_index: 0,
      image_src: [],
      file_src: []
    }
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
        // ***LOGOUT WHEN ACCOUNT CHANGES***
        localStorage.setItem('state', JSON.stringify(false));
        this.redirectToLogin();
        window.location.reload();
      }.bind(this))
    }
  }

  toggleModal(index) {
    this.setState(state => ({ modalIsOpen: !state.modalIsOpen }));
    this.setState({ img_index: index });
  }

  // Load account
  async loadBlockchainData() {

    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      this.setState({ account: accounts[0] })
      const networkId = await web3.eth.net.getId()
      const networkData = Meme.networks[networkId]

      if (networkData) {
        const contract = new web3.eth.Contract(Meme.abi, networkData.address)
        this.setState({ contract })

        // ----Minimise repetition btn Gallery and LogIn
        // ----mby call loadWeb3 from LogIn.js

        let imageSolArray, imageNameSolArray, username, dateUploadImg;
        await contract.methods.get().call({ from: this.state.account }).then((r) => {
          imageSolArray = r[0];
          imageNameSolArray = r[1]
          username = r[2]
          dateUploadImg = r[3]
        })

        if (username !== undefined) {
          this.setState({ username })
        }

        if (dateUploadImg !== undefined) {
          this.setState({ dateUploadImg })
        }

        // let filename_ascii = Web3.utils.hexToAscii(shorten_filename)
        if (imageNameSolArray !== undefined) {
          // {Web3.utils.hexToAscii(this.state.imageNameSolArray[this.state.img_index])}
          this.setState({ imageNameSolArray: imageNameSolArray })
        }

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

          let image_src = [];
          let hashes = this.state.imageHashes.map((image, index) =>
            `https://ipfs.infura.io/ipfs/${image}`)

          for (let i = 0; i < hashes.length; i++) {
            image_src.push({ source: hashes[i] })
          }
          this.setState({ image_src: image_src })
        }






        let fileSolArray, fileNameSolArray, dateUploadFile;
        await contract.methods.getFile().call({ from: this.state.account }).then((r) => {
          fileSolArray = r[0];
          fileNameSolArray = r[1]
          dateUploadFile = r[3]
        })

        if (dateUploadFile !== undefined) {
          this.setState({ dateUploadFile })
        }

        // let filename_ascii = Web3.utils.hexToAscii(shorten_filename)
        if (fileNameSolArray !== undefined) {
          this.setState({ fileNameSolArray: fileNameSolArray })
        }

        if (fileSolArray !== undefined) {
          // Did the hashes, fileHashes is ready to display
          let fileHashes = fileSolArray.slice();
          fileSolArray.forEach(function (item, index) {
            let hashHex = "1220" + item.slice(2)
            let hashBytes = Buffer.from(hashHex, 'hex');
            let hashStr = bs58.encode(hashBytes)
            fileHashes[index] = hashStr;
          });

          this.setState({ fileHashes: fileHashes })

          // FILE LAYOUT %%%%%%%%%%%%
          let fileItems
          fileItems = this.state.fileHashes.map((file, index) => (  // {"https://ipfs.io/ipfs/" + file}

            <div key={index} className="file_store">
              <Document file={`https://ipfs.infura.io/ipfs/${file}`} className="mb-2">
                <Page pageNumber={1} scale={0.35} />
              </Document>

              <a style={{ color: '#80C2AF' }} href={`https://ipfs.infura.io/ipfs/${file}`} target="_blank" rel="noopener noreferrer">{Web3.utils.hexToAscii(this.state.fileNameSolArray[index])}</a>
              <p>{this.state.dateUploadFile[index]}</p>
              <br></br><br></br>
            </div>

          ))
          this.setState({ fileItems: fileItems })
          let file_src = [];
          let hashes = this.state.fileHashes.map((file, index) =>
            `https://ipfs.infura.io/ipfs/${file}`)

          for (let i = 0; i < hashes.length; i++) {
            file_src.push({ source: hashes[i] })
          }
          this.setState({ file_src: file_src })
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
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]     // access file from user input
    const fileName = event.target.files[0].name;
    this.setState({ fileName: fileName })
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    // after reader finishes, initialise buffer and store in component state
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
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
          // let shorten_filename = this.state.fileName.slice(0, -4);
          let shorten_filename = this.state.fileName;

          let hex_filename = Web3.utils.asciiToHex(shorten_filename)
          if (hex_filename.length > 66)
            alert("File name is too large to be stored in the blockchain, please try a shorter name.")
          else {


            let file_extension = shorten_filename.split('.').pop();
            console.log(file_extension)

            if (file_extension == 'pdf') {
              await this.state.contract.methods.setFile(hash_decoded, hex_filename, moment().format('DD-MM-YYYY HH:mm')).send({ from: this.state.account }).then((r) => {
                // refresh to get the new file array with get() of smart contract
                window.location.reload();
              })
            } else {

              await this.state.contract.methods.set(hash_decoded, hex_filename, moment().format('DD-MM-YYYY, HH:mm')).send({ from: this.state.account }).then((r) => {
                // refresh to get the new image array with get() of smart contract
                window.location.reload();
              })
            }

          }
        }
      } catch (e) {
        console.log("Error: ", e)
        alert("Request was rejected.")
      }
    } else {
      alert("No file was submitted. Please try again.")
      console.log('ERROR: No data to submit')
    }
  }

  captionImg = (idx) => {
    return (
      <div>
        <h5 className="mt-2 mb-2"> {Web3.utils.hexToAscii(this.state.imageNameSolArray[idx.currentIndex])}</h5>
        <h5> {this.state.dateUploadImg[idx.currentIndex]}</h5>
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
      <button className="btn btn_download" style={{ outline: "none" }} type="button" onClick={() => { this.downloadImage(currentView.source); }}><BiDownload size="1.8em" /></button> 
      {/* <button className="btn btn_download" style={{ outline: "none" }} type="button" onClick={() => { this.downloadImage(currentView.source); }}><RiUserShared2Line size="1.8em" /></button>  */}

    </div>
  );


  render() {
    return (
      <div className="gallery_bg">
        {(JSON.parse(localStorage.getItem('state'))) ?
          <div>
            <div className="top_gallery_space">
              <h4>Hello {this.state.username},</h4>
              <h3 className="mt-4">Upload a file</h3>

              <div className="container-fluid mt-4">
                <div className="row">
                  <main role="main" className="col-lg-12 d-flex text-center">
                    <div className="content mr-auto ml-auto">

                      <form className="input-group mt-3" onSubmit={this.onSubmit} >
                        <input type="file" accept="image/*, application/pdf" onChange={this.captureFile} className="custom-file-input" /> {/* mx-sm-3 */}
                        <label className="custom-file-label radiu">{this.state.fileName}</label>
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

                    <Tabs className="file_space"  style={{ backgroundColor: '#222', borderBottom: '5px solid white' }} 
                    defaultActiveKey="gallery" id="uncontrolled-tab-example">
                      <Tab eventKey="gallery" title="Gallery">
                       
                      {(this.state.imageHashes.length !== 0 && this.state.fileHashes.length !== 0) ? (

                        <div className="file_space mt-5">
                          {/* <h4 className="mb-5 mt-5">Gallery</h4> */}
                          {this.state.imageItems}
                        </div>

                    ) : <h3>No files to display, try uploading one.</h3>}

                      </Tab>
                      <Tab eventKey="files" title="Files">
                        
                      {(this.state.imageHashes.length !== 0 && this.state.fileHashes.length !== 0) ? (

                        <div className="file_space mt-5">
                          {/* <h4 className="mb-5 mt-5">Files</h4> */}
                          {this.state.fileItems}
                        </div>

                    ) : <h3>No files to display, try uploading one.</h3>}


                      </Tab>

                    </Tabs>

                    {/* {(this.state.imageHashes.length !== 0 && this.state.fileHashes.length !== 0) ? (
                      <div>
                        <div>
                          <h4 className="mb-5">Gallery</h4>
                          {this.state.imageItems}
                        </div>

                        <div className="file_space top_file_space">
                          <h4 className="mb-5 mt-5">Files</h4>
                          {this.state.fileItems}
                        </div>
                      </div>
                    ) : <h3>No files to display, try uploading one.</h3>} */}

                    {/* <ModalGateway>
                          {this.state.modalIsOpen ? (
                            <Modal
                              allowFullscreenBoolean={true}
                              components={{ Header: CustomHeader }} allowFullscreen={false} onClose={() => this.toggleModal(this.state.img_index)}>
                              <div className="imgbox">
                                <img className="center_fit mb-1" src={`https://ipfs.infura.io/ipfs/${this.state.imageHashes[this.state.img_index]}`} alt="inputFile" />
                                <div className="img_caption">
                                  <h5 className="mt-2 mb-2"> Image name: {Web3.utils.hexToAscii(this.state.imageNameSolArray[this.state.img_index])}</h5>
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
                            views={this.state.image_src}
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