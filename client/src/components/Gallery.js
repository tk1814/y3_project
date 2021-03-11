import React, { Component } from 'react';
import bs58 from 'bs58';
import Web3 from "web3";
import CredentialStore from '../contracts/CredentialStore.json';
import Carousel, { Modal, ModalGateway } from 'react-images';
import { BiDownload } from "react-icons/bi";
import { RiUserShared2Line, RiInformationLine } from "react-icons/ri";
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ModalForm from './ModalForm';
import ModalDetails from './ModalDetails';
import Figure from 'react-bootstrap/Figure';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      fileName: 'Choose a file',
      imageItems: [],
      imageHashes: [],
      imageNameSolArray: [],
      imageAddressUserSharedWithSol: [],
      imageHashUserSharedWith: [],
      dateUploadImg: [],
      fileItems: [],
      fileHashes: [],
      fileNameSolArray: [],
      fileAddressUserSharedWithSol: [],
      fileHashUserSharedWith: [],
      dateUploadFile: [],
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      modalIsOpen: false,
      img_index: 0,
      image_src: [],
      file_src: [],
      shareModalIsOpen: null,
      currentImgFileIndex: null,
      typeOfFile: null,
      detailsModalIsOpen: null,
      alreadyShared: false,
      height: 0,
      width: 0,
      filesize: 0,
      imageSharedWith: ['No one'],
      fileSharedWith: ['No one'],
      link_to_be_shared: '',
    }
  }

  redirectToLogin = () => {
    const { history } = this.props;
    if (history) history.push('/login');
  }

  async componentDidMount() {
    await this.loadBlockchainData()

    // Detects eth wallet account change 
    this.ethereum = window.ethereum
    if (this.ethereum) {
      this.ethereum.on('accountsChanged', function (accounts) {
        this.setState({ account: accounts[0] })
        // ***LOGOUT WHEN ACCOUNT CHANGES***
        localStorage.clear();
        this.redirectToLogin();
        window.location.reload();
      }.bind(this))
    }
  }

  // Load account
  async loadBlockchainData() {

    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      this.setState({ account: accounts[0] })
      const networkId = await web3.eth.net.getId()
      const networkData = CredentialStore.networks[networkId]

      if (networkData) {
        const contract = new web3.eth.Contract(CredentialStore.abi, networkData.address)
        this.setState({ contract })

        let imageSolArray, imageNameSolArray, username, dateUploadImg, imageAddressUserSharedWithSol, imageHashUserSharedWithSol;
        await contract.methods.get().call({ from: this.state.account }).then((r) => {
          imageSolArray = r[0];
          imageNameSolArray = r[1]
          username = r[2]
          dateUploadImg = r[3]
          imageAddressUserSharedWithSol = r[4]
          imageHashUserSharedWithSol = r[5]
        })

        if (imageAddressUserSharedWithSol !== undefined) {
          this.setState({ imageAddressUserSharedWithSol })
        }

        if (imageHashUserSharedWithSol !== undefined) {
          let imageHashUserSharedWith = imageHashUserSharedWithSol.slice();
          imageHashUserSharedWithSol.forEach(function (item, index) {
            imageHashUserSharedWith[index] = bs58.encode(Buffer.from("1220" + item.slice(2), 'hex'));
          });
          this.setState({ imageHashUserSharedWith })
        }

        if (username !== undefined) {
          this.setState({ username })
        }

        if (dateUploadImg !== undefined) {
          this.setState({ dateUploadImg })
        }

        if (imageNameSolArray !== undefined) {
          this.setState({ imageNameSolArray })
        }

        if (imageSolArray !== undefined) {
          // Did the hashes, imageHashes is ready to display
          let imageHashes = imageSolArray.slice();
          imageSolArray.forEach(function (item, index) {
            imageHashes[index] = bs58.encode(Buffer.from("1220" + item.slice(2), 'hex'));
          });

          this.setState({ imageHashes })

          // Image layout
          let imageItems
          imageItems = this.state.imageHashes.map((image, index) => (

            <Figure key={index} className="mr-4" style={{ textAlign: 'center' }} >
              <React.Fragment>
                <div className="block-icon">
                  <Figure.Image className="img"
                    alt="inputFile"
                    src={`https://ipfs.infura.io/ipfs/${image}`}
                    onClick={() => this.toggleModal(index)} />

                  <button className="btn btn_download download_icon icon-tag" type="button"
                    onClick={() => this.openDetailsModal(index, 'image')}
                  ><RiInformationLine size="1.6em" /></button>
                </div>
              </React.Fragment>

              <Figure.Caption className='caption' >
                <p className="ml-3 mt-2 p1 image_name">{Web3.utils.hexToAscii(this.state.imageNameSolArray[index]).split('.').slice(0, -1).join('.')}</p>
                <button className="btn btn_download share_icon" type="button" onClick={() => this.openModal(index, image, 'image')}><RiUserShared2Line size="1.4em" /></button>
                <button className="btn btn_download download_icon" type="button" onClick={() => {
                  if (Web3.utils.hexToAscii(this.state.imageNameSolArray[index]).match(/.(gif)/i))
                    this.downloadFile(`https://ipfs.infura.io/ipfs/${image}`, 'gif', Web3.utils.hexToAscii(this.state.imageNameSolArray[index]).split('.').slice(0, -1).join('.'));
                  else
                    this.downloadFile(`https://ipfs.infura.io/ipfs/${image}`, 'image', Web3.utils.hexToAscii(this.state.imageNameSolArray[index]).split('.').slice(0, -1).join('.'));
                }}><BiDownload size="1.5em" /></button>

              </Figure.Caption>
            </Figure>
          ))
          this.setState({ imageItems })

          let image_src = [];
          let hashes = this.state.imageHashes.map((image, index) =>
            `https://ipfs.infura.io/ipfs/${image}`)

          for (let i = 0; i < hashes.length; i++) {
            image_src.push({ source: hashes[i] })
          }
          this.setState({ image_src })
        }

        // Files
        let fileSolArray, fileNameSolArray, dateUploadFile, fileAddressUserSharedWithSol, fileHashUserSharedWithSol;
        await contract.methods.getFile().call({ from: this.state.account }).then((r) => {
          fileSolArray = r[0];
          fileNameSolArray = r[1]
          dateUploadFile = r[3]
          fileAddressUserSharedWithSol = r[4]
          fileHashUserSharedWithSol = r[5]
        })

        if (fileAddressUserSharedWithSol !== undefined) {
          this.setState({ fileAddressUserSharedWithSol })
        }

        if (fileHashUserSharedWithSol !== undefined) {
          let fileHashUserSharedWith = fileHashUserSharedWithSol.slice();
          fileHashUserSharedWithSol.forEach(function (item, index) {
            fileHashUserSharedWith[index] = bs58.encode(Buffer.from("1220" + item.slice(2), 'hex'));
          });
          this.setState({ fileHashUserSharedWith })
        }

        if (dateUploadFile !== undefined) {
          this.setState({ dateUploadFile })
        }

        if (fileNameSolArray !== undefined) {
          this.setState({ fileNameSolArray })
        }

        if (fileSolArray !== undefined) {
          let fileHashes = fileSolArray.slice();
          fileSolArray.forEach(function (item, index) {
            fileHashes[index] = bs58.encode(Buffer.from("1220" + item.slice(2), 'hex'));
          });

          this.setState({ fileHashes })

          // File layout
          let fileItems
          fileItems = this.state.fileHashes.map((file, index) => (

            <div key={index} className="file_store mb-4">
              <React.Fragment>
                <div className="block-icon">
                  <Document file={`https://ipfs.infura.io/ipfs/${file}`} className="mb-2 block-icon">
                    <Page pageNumber={1} scale={0.35} />
                  </Document>

                  <button className="btn btn_download download_icon icon-tag" type="button"
                    onClick={() => this.openDetailsModal(index, 'file')}><RiInformationLine size="1.6em" style={{ color: '#000' }} /></button>

                </div>
              </React.Fragment>

              <div className='caption'>
                <a className='mb-4 ml-2' style={{ color: '#80C2AF' }} href={`https://ipfs.infura.io/ipfs/${file}`} target="_blank" rel="noopener noreferrer">{Web3.utils.hexToAscii(this.state.fileNameSolArray[index])}</a>
                <button className="btn btn_download ml-3 share_icon" type="button" onClick={() => this.openModal(index, file, 'file')}><RiUserShared2Line size="1.4em" /></button>
                <button className="btn btn_download download_icon" type="button" onClick={() => { this.downloadFile(`https://ipfs.infura.io/ipfs/${file}`, 'file', Web3.utils.hexToAscii(this.state.fileNameSolArray[index]).split('.').slice(0, -1).join('.')); }}><BiDownload size="1.5em" /></button>
              </div>
            </div>

          ))
          this.setState({ fileItems })
          let file_src = [];
          let hashes = this.state.fileHashes.map((file, index) =>
            `https://ipfs.infura.io/ipfs/${file}`)

          for (let i = 0; i < hashes.length; i++) {
            file_src.push({ source: hashes[i] })
          }
          this.setState({ file_src })
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

  // Convert uploaded file to appropriate format for IPFS and store in state
  captureFile = (event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    const fileName = event.target.files[0].name;
    this.setState({ fileName })
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
    }
  }


  // uploads the buffer file stored in state to IPFS using ipfs API
  // store the IPFS hash in the smart contract
  onSubmit = async (event) => {
    event.preventDefault()
    // console.log("Submitting file to ipfs...")

    let buffer_data = this.state.buffer
    if (buffer_data) {
      try {

        let file_name = this.state.fileName;
        if (file_name.match(/.(jpg|jpeg|png|gif|pdf)$/i)) {
          // Add to ipfs (off-chain)
          const file = await ipfs.add(this.state.buffer)
          let file_hash = file.path // 46

          // check if hash exists so the user does not pay to re-execute the contract function
          if (file_name.match(/.(jpg|jpeg|png|gif)$/i) && this.state.imageHashes.find(img_itm => img_itm === file_hash)) {
            alert('This image already exists. Please select a different one.');
          } else if (file_name.match(/.(pdf)$/i) && this.state.fileHashes.find(file_itm => file_itm === file_hash)) {
            alert('This file already exists. Please select a different one.');
          } else {

            let hash_decoded = bs58.decode(file_hash).slice(2); // 32
            let hex_filename = Web3.utils.asciiToHex(file_name)

            if (hex_filename.length > 66)
              alert("File name is too large to be stored in the blockchain, please try a shorter name.")
            else {

              if (file_name.match(/.(pdf)$/i)) {
                await this.state.contract.methods.setFile(hash_decoded, hex_filename, Date().toLocaleString()).send({ from: this.state.account }).then((r) => {
                  // refresh to get the new file array with get() of smart contract
                  window.location.reload();
                })
              } else if (file_name.match(/.(jpg|jpeg|png|gif)$/i)) {
                await this.state.contract.methods.set(hash_decoded, hex_filename, Date().toLocaleString()).send({ from: this.state.account }).then((r) => {
                  window.location.reload();
                })
              }
            }
          }
        } else {
          alert('File type is not supported. \nOnly pdf, jpg, jpeg, png, gif file types are supported.');
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

  downloadFile = (file, typeOfFile, nameWithoutExt) => {
    fetch(file, {
      method: "GET",
      headers: {}
    }).then(response => {
      response.arrayBuffer().then(function (buffer) {
        const url = window.URL.createObjectURL(new Blob([buffer]));
        const link = document.createElement("a");
        link.href = url;
        if (typeOfFile === 'file')
          link.setAttribute("download", nameWithoutExt + ".pdf");
        else if (typeOfFile === 'image')
          link.setAttribute("download", nameWithoutExt + ".png");
        else if (typeOfFile === 'gif')
          link.setAttribute("download", nameWithoutExt + ".gif");
        document.body.appendChild(link);
        link.click();
      });
    }).catch(err => {
      console.log(err);
    });
  }

  toggleModal(index) {
    this.setState(state => ({ modalIsOpen: !state.modalIsOpen }));
    this.setState({ img_index: index });
  }

  openModal = (currentImgFileIndex, link_to_be_shared, typeOfFile) => {
    // set to false to remove the warning for the next share
    this.setState({ alreadyShared: false })
    this.setState({ shareModalIsOpen: true });
    this.setState({ link_to_be_shared })
    this.setState({ currentImgFileIndex })
    this.setState({ typeOfFile })
  }

  openDetailsModal = (currentImgFileIndex, typeOfFile) => {
    var remote = require('remote-file-size');
    const prettyBytes = require('pretty-bytes');

    this.setState({ detailsModalIsOpen: true });
    this.setState({ currentImgFileIndex })
    this.setState({ typeOfFile })

    if (typeOfFile === 'image') {

      const img = new Image();
      img.src = this.state.image_src[currentImgFileIndex].source;
      img.onload = () => {
        // image  has been loaded
        this.setState({ height: img.height })
        this.setState({ width: img.width })
      };

      // get shared with whom
      let imageSharedWith = [];
      for (let i = 0; i < this.state.imageAddressUserSharedWithSol.length; i++) {
        if (this.state.imageHashUserSharedWith[i] === this.state.imageHashes[currentImgFileIndex]) {
          imageSharedWith.push(this.state.imageAddressUserSharedWithSol[i])
          this.setState({ imageSharedWith })
        }
      }

      // get image size
      remote(this.state.image_src[currentImgFileIndex].source, (err, res) => {
        this.setState({ filesize: prettyBytes(res) })
      })

    } else if (typeOfFile === 'file') {

      // get file size
      remote(this.state.file_src[currentImgFileIndex].source, (err, res) => {
        this.setState({ filesize: prettyBytes(res) })
      })

      let fileSharedWith = [];
      for (let i = 0; i < this.state.fileAddressUserSharedWithSol.length; i++) {
        if (this.state.fileHashUserSharedWith[i] === this.state.fileHashes[currentImgFileIndex]) {
          fileSharedWith.push(this.state.fileAddressUserSharedWithSol[i])
          this.setState({ fileSharedWith })
        }
      }
    }
  }

  closeDetailsModal = () => {
    this.setState({ detailsModalIsOpen: false });
    this.setState({ imageSharedWith: ['No one'] })
    this.setState({ fileSharedWith: ['No one'] })
  }

  closeModal = () => { this.setState({ shareModalIsOpen: false }); }

  handleSubmit = async (input_address, viewOnly) => {

    let current_address = this.state.account
    try {
      if (!input_address) {
        alert('No public address was entered. Please enter a public address.')
      } else if (input_address.toLowerCase() === current_address.toLowerCase()) {
        alert('Cannot share images with yourself')
      } else {

        if (this.state.typeOfFile === 'image') {

          let fileAlreadyShared = false;
          for (let i = 0; i < this.state.imageHashUserSharedWith.length; i++) {
            if (this.state.imageHashUserSharedWith[i] === this.state.link_to_be_shared && this.state.imageAddressUserSharedWithSol[i] === input_address) {
              fileAlreadyShared = true;
              break;
            }
          }

          if (fileAlreadyShared) {
            this.setState({ alreadyShared: true })
          } else {
            this.setState({ alreadyShared: false })

            let hash_decoded = bs58.decode(this.state.link_to_be_shared).slice(2);
            let hex_filename = this.state.imageNameSolArray[this.state.currentImgFileIndex]
            await this.state.contract.methods.shareImage(this.state.username, input_address, hash_decoded, hex_filename, Date().toLocaleString(), viewOnly).send({ from: this.state.account }).then((r) => {
              this.closeModal();
              window.location.reload();
            })
          }

        } else if (this.state.typeOfFile === 'file') {

          let fileAlreadyShared = false;
          for (let i = 0; i < this.state.fileAddressUserSharedWithSol.length; i++) {
            if (this.state.fileHashUserSharedWith[i] === this.state.link_to_be_shared && this.state.fileAddressUserSharedWithSol[i] === input_address) {
              fileAlreadyShared = true;
              break;
            }
          }

          if (fileAlreadyShared) {
            this.setState({ alreadyShared: true })
          } else {
            this.setState({ alreadyShared: false })

            let hash_decoded = bs58.decode(this.state.link_to_be_shared).slice(2);
            let hex_filename = this.state.fileNameSolArray[this.state.currentImgFileIndex]
            await this.state.contract.methods.shareFile(this.state.username, input_address, hash_decoded, hex_filename, Date().toLocaleString(), viewOnly).send({ from: this.state.account }).then((r) => {
              this.closeModal();
              window.location.reload();
            })
          }
        }
      }

    } catch (e) {
      // set to false to remove the warning for the next share
      this.setState({ alreadyShared: false })
      this.closeModal();
      // console.log(e);
      alert("Wrong public address entered or Request was rejected.")
    }
  }

  render() {

    let fileType;
    if (this.state.typeOfFile === 'image')
      fileType = true
    else if (this.state.typeOfFile === 'file')
      fileType = false

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
                        <button type='submit' className="btn submit_btn mt-4 container input_box">Submit</button>
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

                    {this.state.shareModalIsOpen ?
                      <ModalForm
                        closeModal={this.closeModal}
                        isOpen={this.state.shareModalIsOpen}
                        handleSubmit={this.handleSubmit}
                        shared={this.state.alreadyShared} /> : null}

                    <Tabs className="file_space table"
                      defaultActiveKey="gallery" id="uncontrolled-tab-example">
                      <Tab eventKey="gallery" title="Gallery">

                        {(this.state.imageHashes.length !== 0) ? (
                          <div className="file_space mt-5">
                            {this.state.imageItems}
                            {/* Image details modal */}
                            {this.state.detailsModalIsOpen && fileType ?
                              <ModalDetails className='whitespace_wrap'
                                closeModal={this.closeDetailsModal}
                                isOpen={this.state.detailsModalIsOpen}
                                fileType={'image'}
                                type={'Image name:    '}
                                detailType={'Image Details'}
                                fileName={Web3.utils.hexToAscii(this.state.imageNameSolArray[this.state.currentImgFileIndex])}
                                fileDate={this.state.dateUploadImg[this.state.currentImgFileIndex]}
                                height={this.state.height}
                                width={this.state.width}
                                filesize={this.state.filesize}
                                whoSharedWith={this.state.imageSharedWith}
                                gallery={true} />
                              : null}
                          </div>
                        ) : <h3 className="mt-5">No images to display, try uploading one.</h3>}

                      </Tab>
                      <Tab eventKey="files" title="Files">

                        {(this.state.fileHashes.length !== 0) ? (
                          <div className="file_space mt-5">
                            {this.state.fileItems}
                            {/* File details modal */}
                            {this.state.detailsModalIsOpen && !fileType ?
                              <ModalDetails className='whitespace_wrap'
                                closeModal={this.closeDetailsModal}
                                isOpen={this.state.detailsModalIsOpen}
                                fileType={'file'}
                                type={'File name:         '}
                                detailType={'File Details'}
                                fileName={Web3.utils.hexToAscii(this.state.fileNameSolArray[this.state.currentImgFileIndex])}
                                fileDate={this.state.dateUploadFile[this.state.currentImgFileIndex]}
                                filesize={this.state.filesize}
                                whoSharedWith={this.state.fileSharedWith}
                                gallery={true} />
                              : null}
                          </div>
                        ) : <h3 className="mt-5">No files to display, try uploading one.</h3>}

                      </Tab>
                    </Tabs>



                    <ModalGateway>
                      {this.state.modalIsOpen ? (
                        <Modal onClose={() => this.toggleModal(this.state.img_index)}>
                          <Carousel
                            currentIndex={this.state.img_index}
                            views={this.state.image_src}
                            styles={{
                              container: base => ({ ...base, height: '100vh', }),
                              view: base => ({ ...base, alignItems: 'center', display: 'flex ', height: 'calc(100vh - 54px)', justifyContent: 'center', '& > img': { maxHeight: 'calc(100vh - 94px)', }, })
                            }} />
                        </Modal>) : ''}
                    </ModalGateway>

                    <div className="footer_space"></div>
                  </div>
                </main>
              </div>
            </div>

          </div>
          : (<div className="top_gallery_space" >
            <h3>User not logged in.</h3>
          </div>)}
      </div >
    );
  }
}

export default Gallery;