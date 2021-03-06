import React, { Component } from 'react';
import bs58 from 'bs58';
import Web3 from "web3";
import Meme from '../contracts/Meme.json';
import Carousel, { Modal, ModalGateway } from 'react-images';
import { BiDownload } from "react-icons/bi";
import { Table } from 'react-bootstrap';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ModalForm from './ModalForm';
// import Alert from 'react-bootstrap/Alert';
// import ReactWaterMark from 'react-watermark-component';
import { RiUserShared2Line, RiInformationLine } from "react-icons/ri";
import { BiSort } from "react-icons/bi";
import ModalDetails from './ModalDetails';
import ReactImageProcess from 'react-image-process';
// import PDF from 'react-pdf-watermark';
// import PDFViewer from './PDFViewer';
// import WaterMarkExample from './WaterMarkExample';
// import PdfViewer from './PdfViewer';
// import jsPDF from "jspdf";
// import WebViewer from '@pdftron/pdfjs-express';
// {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.4/jspdf.min.js"></script> */ }


class Sharepoint extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      items: [],
      imageItems: [],
      imageHashesShared: [],
      // imageNameSolArray: [],
      imageNamesSharedSolArray: [],
      addressSharedwithUserSolArray: [],
      usernameSharedWithUserSolArray: [],
      dateSharedImage: [],
      viewOnlyImageArr: [],
      // fileHashesNotShared: [],
      fileHashesShared: [],
      fileNamesSharedSolArray: [],
      fileAddressSharedwithUserSolArray: [],
      fileUsernameSharedWithUserSolArray: [],
      dateSharedFile: [],
      viewOnlyFileArr: [],
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      modalIsOpen: false,
      img_index: 0,
      image_shared_src: [],
      file_shared_src: [],
      detailsModalIsOpen: null,
      shareModalIsOpen: null,
      alreadyShared: false,
      imageHashUserSharedWith: [],
      imageAddressUserSharedWithSol: [],
      fileHashUserSharedWith: [],
      fileAddressUserSharedWithSol: [],
      height: 0,
      width: 0,
      filesize: 0,
      imageSharedWith: ['No one'],
      fileSharedWith: ['No one'],
      link_to_be_shared: '',
    }
    // this.toggleModal = this.toggleModal.bind(this);
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
      console.log('Window: ' + window.ethereum.selectedAddress)

      this.ethereum.on('accountsChanged', function (accounts) {
        this.setState({ account: accounts[0] })
        localStorage.setItem('state', JSON.stringify(false));

        this.redirectToLogin();
        window.location.reload();
      }.bind(this))
    }
    // disable right click menu
    // document.addEventListener('contextmenu', (e) => {
    //   e.preventDefault();
    // });
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

        // LOAD Shared images array
        let imageSharedSolArray, imageNamesSharedSolArray, addressSharedwithUserSolArray, usernameSharedWithUserSolArray, dateSharedImage, viewOnlyImageArr;
        await contract.methods.getSharedImageArr().call({ from: this.state.account }).then((r) => {
          imageSharedSolArray = r[0]
          imageNamesSharedSolArray = r[1]
          addressSharedwithUserSolArray = r[2]
          usernameSharedWithUserSolArray = r[3]
          dateSharedImage = r[4]
          viewOnlyImageArr = r[5]

          if (viewOnlyImageArr !== undefined) {
            this.setState({ viewOnlyImageArr })
          }

          if (dateSharedImage !== undefined) {
            this.setState({ dateSharedImage })
          }

          if (imageSharedSolArray !== undefined && imageNamesSharedSolArray !== undefined && addressSharedwithUserSolArray !== undefined
            && usernameSharedWithUserSolArray !== undefined) {
            let imageHashesShared = imageSharedSolArray.slice()
            imageSharedSolArray.forEach(function (item, index) {
              imageHashesShared[index] = bs58.encode(Buffer.from("1220" + item.slice(2), 'hex'));
            });

            this.setState({ imageHashesShared })
            this.setState({ imageNamesSharedSolArray })
            this.setState({ addressSharedwithUserSolArray })
            this.setState({ usernameSharedWithUserSolArray })

            // IMAGE LAYOUT %%%%%%%%%%%%
            let imageHashesSharedItems
            imageHashesSharedItems = this.state.imageHashesShared.map((image, index) => (
              <img key={index} onClick={() => this.toggleModal(index)} className="mr-4 mb-3 mt-4 img_item" src={`https://ipfs.infura.io/ipfs/${image}`} alt="inputFile" />
            ))
            this.setState({ imageHashesSharedItems })

            let image_shared_src = [];
            let hashes = this.state.imageHashesShared.map((image, index) =>
              `https://ipfs.infura.io/ipfs/${image}`)

            for (let i = 0; i < hashes.length; i++) {
              image_shared_src.push({ source: hashes[i] })
            }
            this.setState({ image_shared_src })

            // SHARED IMAGES ITEMS
            const imageItems = [];
            for (let i = 0; i < image_shared_src.length; i++) {
              imageItems.push({
                id: i,
                Name: Web3.utils.hexToAscii(this.state.imageNamesSharedSolArray[i]),
                Image: this.state.image_shared_src[i].source,
                From: this.state.usernameSharedWithUserSolArray[i],
                Address: this.state.addressSharedwithUserSolArray[i],
                Date: this.state.dateSharedImage[i]
              });
            }
            this.setState({ imageItems })
          }

        });


        // LOAD Shared files array %%%%%%%%%%%%%%%
        let fileSharedSolArray, fileNamesSharedSolArray, fileAddressSharedwithUserSolArray, fileUsernameSharedWithUserSolArray, dateSharedFile, viewOnlyFileArr;
        await contract.methods.getSharedFileArr().call({ from: this.state.account }).then((r) => {
          fileSharedSolArray = r[0]
          fileNamesSharedSolArray = r[1]
          fileAddressSharedwithUserSolArray = r[2]
          fileUsernameSharedWithUserSolArray = r[3]
          dateSharedFile = r[4]
          viewOnlyFileArr = r[5]

          if (viewOnlyFileArr !== undefined) {
            this.setState({ viewOnlyFileArr })
          }

          if (dateSharedFile !== undefined) {
            this.setState({ dateSharedFile })
          }

          if (fileSharedSolArray !== undefined && fileNamesSharedSolArray !== undefined && fileAddressSharedwithUserSolArray !== undefined
            && fileUsernameSharedWithUserSolArray !== undefined) {
            let fileHashesShared = fileSharedSolArray.slice()
            fileSharedSolArray.forEach(function (item, index) {
              fileHashesShared[index] = bs58.encode(Buffer.from("1220" + item.slice(2), 'hex'));
            });

            this.setState({ fileHashesShared })
            this.setState({ fileNamesSharedSolArray })
            this.setState({ fileAddressSharedwithUserSolArray })
            this.setState({ fileUsernameSharedWithUserSolArray })

            let file_shared_src = [];
            let hashes = this.state.fileHashesShared.map((file, index) =>
              `https://ipfs.infura.io/ipfs/${file}`)

            for (let i = 0; i < hashes.length; i++) {
              file_shared_src.push({ source: hashes[i] })
            }
            this.setState({ file_shared_src })

            // SHARED FILES ITEMS
            const items = [];
            for (let i = 0; i < file_shared_src.length; i++) {
              items.push({
                id: i,
                Name: Web3.utils.hexToAscii(this.state.fileNamesSharedSolArray[i]),
                File: this.state.file_shared_src[i].source,
                From: this.state.fileUsernameSharedWithUserSolArray[i],
                Address: this.state.fileAddressSharedwithUserSolArray[i],
                Date: this.state.dateSharedFile[i]
              });
            }
            this.setState({ items })
          }
        });



        // get images user shared with others &&&&&&&&&&&&&&&&&
        let username, imageAddressUserSharedWithSol, imageHashUserSharedWithSol;
        await contract.methods.get().call({ from: this.state.account }).then((r) => {
          username = r[2]
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

        // get files user shared with others &&&&&&&&&&&&&&&&&
        let fileAddressUserSharedWithSol, fileHashUserSharedWithSol;
        await contract.methods.getFile().call({ from: this.state.account }).then((r) => {
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

  toggleModal = (index) => {
    this.setState(state => ({ modalIsOpen: !state.modalIsOpen }));
    this.setState({ img_index: index });
  }

  downloadFile = (file, typeOfFile, nameWithExt) => {
    let file_name = nameWithExt.split('.').slice(0, -1).join('.')
    fetch(file, {
      method: "GET",
      headers: {}
    }).then(response => {
      response.arrayBuffer().then(function (buffer) {
        const url = window.URL.createObjectURL(new Blob([buffer]));
        const link = document.createElement("a");
        link.href = url;
        if (typeOfFile === 'file')
          link.setAttribute("download", file_name + ".pdf");
        else if (typeOfFile === 'image')
          link.setAttribute("download", file_name + ".png");
        else if (typeOfFile === 'gif')
          link.setAttribute("download", file_name + ".gif");
        document.body.appendChild(link);
        link.click();
      });
    }).catch(err => {
      console.log(err);
    });
  }

  openModal = (currentImgFileIndex, typeOfFile) => {
    // set to false to remove the warning for the next share
    this.setState({ alreadyShared: false })
    this.setState({ shareModalIsOpen: true });

    if (typeOfFile === 'image')
      this.setState({ link_to_be_shared: this.state.imageHashesShared[currentImgFileIndex] })
    else if (typeOfFile === 'file')
      this.setState({ link_to_be_shared: this.state.fileHashesShared[currentImgFileIndex] })

    this.setState({ currentImgFileIndex })
    this.setState({ typeOfFile })
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

        // var watermark = require('image-watermark');
        // var options = {
        //   'text' : 'sample watermark',
        //   'override-image' : true
        // };
        // watermark.embedWatermark(this.state.imageItems[0].Image, options);

        // var im = require('imagemagick');
        // im.readMetadata(this.state.imageItems[this.state.currentImgFileIndex].Image, function (err, metadata) {
        //   if (err) throw err;
        //   console.log('Shot at ' + metadata.exif.dateTimeOriginal);
        // })

        // var watermark = require('dynamic-watermark');
        // var optionsImageWatermark = {
        //   type: "image",
        //   source: "this.state.imageItems[this.state.currentImgFileIndex].Image",
        //   // logo: "logo.png", // This is optional if you have provided text Watermark
        //   destination: "output.png",
        //   position: {
        //     logoX: 200,
        //     logoY: 200,
        //     logoHeight: 200,
        //     logoWidth: 200
        //   }
        // };

        // var optionsTextWatermark = {
        //   type: "text",
        //   text: "Watermark text", // This is optional if you have provided text Watermark
        //   destination: "output.png",
        //   source: this.state.imageItems[this.state.currentImgFileIndex].Image,
        //   position: {
        //     logoX: 200,
        //     logoY: 200,
        //     logoHeight: 200,
        //     logoWidth: 200
        //   },
        //   textOption: {
        //     fontSize: 100, //In px default : 20
        //     color: '#AAF122' // Text color in hex default: #000000
        //   }
        // };
        // //optionsImageWatermark or optionsTextWatermark
        // watermark.embed(optionsTextWatermark, function (status) {
        //   //Do what you want to do here
        //   console.log(status);
        // });



        // var dyWatermark = require('imagemagick-dynamic-watermark');

        // var options = {
        //   source: this.state.imageItems[this.state.currentImgFileIndex].Image,
        //   destination: './images/a1_edited/jpg',
        //   type: 'watermark',

        //   //if type contain watermark
        //   watermark: {
        //     logo: './assets/logo.png',
        //     gravity: 'Center',
        //     logoWidth: 100,
        //     logoHeight: 100,
        //     logoWidthPercent: 0.1,
        //     logoHeightPercent: 0.1
        //   },

        //   //if type contain crop
        //   crop: {
        //     gravity: 'Center',
        //     width: 100,
        //     height: 100
        //   }
        // }

        // dyWatermark.apply(options, (err, isOk) => {
        //   if (err) throw new Error(err);
        //   //do something, happy coding!
        //   console.log(isOk)
        // });


        // // place a watermark in the upper left hand corner of an image
        // watermark([this.state.imageItems[this.state.currentImgFileIndex].Image, '/img/logo.png'])
        //   .image(function (coffee, logo) {
        //     var context = coffee.getContext('2d');
        //     context.save();

        //     context.globalAlpha = alpha;
        //     context.drawImage(logo, 10, 10);

        //     context.restore();
        //     return target;
        //   });

        // var options = {
        //   init: function (img) {
        //     img.crossOrigin = "anonymous";
        //   }
        // };
        // watermark(
        //   ["https://www.hometown.in/media/product/88/5392/57299/1-product_500.jpg"],
        //   options
        // )
        //   .image(
        //     watermark.text.lowerRight(
        //       "watermark.js",
        //       "48px Josefin Slab",
        //       "#fff",
        //       0.5
        //     )
        //   )
        //   .then(function (img) {
        //     console.log(img);
        //   });


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
            let hex_filename = this.state.imageNamesSharedSolArray[this.state.currentImgFileIndex]
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
            let hex_filename = this.state.fileNamesSharedSolArray[this.state.currentImgFileIndex]
            await this.state.contract.methods.shareFile(this.state.username, input_address, hash_decoded, hex_filename, Date().toLocaleString(), viewOnly).send({ from: this.state.account }).then((r) => {
              this.closeModal();
              window.location.reload();
            })
          }
        }
      }

      // empty the array to check whether images were selected next time
      // this.setState({ link_to_be_shared: null })

    } catch (e) {
      // set to false to remove the warning for the next share
      this.setState({ alreadyShared: false })
      this.closeModal();
      // console.log(e);
      alert("Wrong public address entered or Request was rejected.")
    }
  }


  openDetailsModal = (currentImgFileIndex, typeOfFile) => {
    var remote = require('remote-file-size');
    const prettyBytes = require('pretty-bytes');

    this.setState({ detailsModalIsOpen: true });
    this.setState({ currentImgFileIndex })
    this.setState({ typeOfFile })

    if (typeOfFile === 'image') {

      const img = new Image();
      img.src = this.state.imageItems[currentImgFileIndex].Image;
      img.onload = () => {
        this.setState({ height: img.height })
        this.setState({ width: img.width })
      };

      // populate array with addresses that the selected image was shared with 
      let imageSharedWith = [];
      for (let i = 0; i < this.state.imageAddressUserSharedWithSol.length; i++) {
        if (this.state.imageHashUserSharedWith[i] === this.state.imageHashesShared[currentImgFileIndex]) {
          imageSharedWith.push(this.state.imageAddressUserSharedWithSol[i])
          this.setState({ imageSharedWith })
        }
      }

      // get image size
      remote(this.state.imageItems[currentImgFileIndex].Image, (err, res) => {
        this.setState({ filesize: prettyBytes(res) })
      })

    } else if (typeOfFile === 'file') {

      // get file size
      remote(this.state.items[currentImgFileIndex].File, (err, res) => {
        this.setState({ filesize: prettyBytes(res) })
      })

      // populate array with addresses that the selected file was shared with 
      let fileSharedWith = [];
      for (let i = 0; i < this.state.fileAddressUserSharedWithSol.length; i++) {
        if (this.state.fileHashUserSharedWith[i] === this.state.fileHashesShared[currentImgFileIndex]) {
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

  onComplete = data => {
    console.log(data);
    console.log('somsers')
  };

  reverseItems = (typeOfFile) => {
    if (typeOfFile === 'image') {
      let reverseImageItems = this.state.imageItems.reverse();
      this.setState({ imageItems: reverseImageItems })
    } else if (typeOfFile === 'file') {
      let reverseFileItems = this.state.items.reverse();
      this.setState({ items: reverseFileItems })
    }
  }

  redirectToPDFViewer = (itm) => {
    localStorage.setItem('item', JSON.stringify(itm));
    localStorage.setItem('address', JSON.stringify(this.state.items[this.state.img_index].Address));
    window.open('/PdfViewer')
  }

  render() {

    // const text = this.state.account;
    // const beginAlarm = function () { console.log('start alarm'); };
    // const options = {
    //   chunkWidth: 200,
    //   chunkHeight: 60,
    //   textAlign: 'left',
    //   textBaseline: 'bottom',
    //   globalAlpha: 2.17,
    //   font: '12px Microsoft Yahei',
    //   rotateAngle: -0.26,
    //   fillStyle: '#000',
    // }

    let fileType;
    if (this.state.typeOfFile === 'image')
      fileType = true
    else if (this.state.typeOfFile === 'file')
      fileType = false

    return (
      <div className="simple_bg">

        {(JSON.parse(localStorage.getItem('state'))) ?
          <div className="container-fluid">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">

                  <ModalGateway>
                    {this.state.modalIsOpen ? (
                      <Modal onClose={() => this.toggleModal(this.state.img_index)}>
                        {this.state.viewOnlyImageArr[this.state.img_index] ?

                          <ReactImageProcess onComplete={this.onComplete}
                            mode="waterMark"
                            waterMarkType="text"
                            waterMark={this.state.imageItems[this.state.img_index].Address}
                            fontBold={false}
                            fontSize={20}
                            fontColor="#fff"
                            coordinate={[10, 20]}>

                            {/* {       let image_shared_src = [];
                                        let hashes = this.state.imageHashesShared.map((image, index) =>
                                          `https://ipfs.infura.io/ipfs/${image}`)

                                        for (let i = 0; i < hashes.length; i++) {
                                          image_shared_src.push({ source: hashes[i] })
                                        }
                                        this.setState({ image_shared_src }) } */}
                            {/* } */}

                            {/* // <ReactWaterMark
                          //   waterMarkText={text}
                          //   openSecurityDefense
                          //   securityAlarm={beginAlarm}
                          //   options={options}> */}

                            <Carousel currentIndex={this.state.img_index} views={this.state.image_shared_src} styles={{
                              container: base => ({ ...base, height: '100vh', }),
                              view: base => ({ ...base, alignItems: 'center', display: 'flex ', height: 'calc(100vh - 54px)', justifyContent: 'center', '& > img': { maxHeight: 'calc(100vh - 94px)', }, })
                            }} />

                            {/* </ReactWaterMark> */}
                          </ReactImageProcess>

                          :

                          <Carousel currentIndex={this.state.img_index} views={this.state.image_shared_src} styles={{
                            container: base => ({ ...base, height: '100vh', }),
                            view: base => ({ ...base, alignItems: 'center', display: 'flex ', height: 'calc(100vh - 54px)', justifyContent: 'center', '& > img': { maxHeight: 'calc(100vh - 94px)', }, })
                          }} />}

                        {/*                          
                        {!this.state.viewOnlyImageArr[this.state.img_index] &&

                            <Carousel currentIndex={this.state.img_index} views={this.state.image_shared_src} styles={{
                              container: base => ({ ...base, height: '100vh', }),
                              view: base => ({
                                ...base, alignItems: 'center', display: 'flex ', height: 'calc(100vh - 54px)', justifyContent: 'center', '& > img': { maxHeight: 'calc(100vh - 94px)', },
                              })
                            }} /> } */}


                        {/* <Carousel currentIndex={this.state.img_index} views={this.state.image_shared_src} styles={{
                          container: base => ({ ...base, height: '100vh', }),
                          view: base => ({
                            ...base, alignItems: 'center', display: 'flex ', height: 'calc(100vh - 54px)', justifyContent: 'center', '& > img': { maxHeight: 'calc(100vh - 94px)', },
                          })
                        }} /> */}

                      </Modal>) : ''}
                  </ModalGateway>

                  {/* // <ReactImageProcess onComplete={this.onComplete}
                    //   mode="waterMark"
                    //   waterMarkType="text"
                    //   waterMark={this.state.imageItems[this.state.img_index].Address}
                    //   fontBold={false}
                    //   fontSize={20}
                    //   fontColor="#fff"
                    //   coordinate={[10, 20]}>
                    // </ReactImageProcess>} */}

                  <div className="smaller_space"></div>

                  {/* <div style={{ maxWidth: 500 }}>
                    {
                      ['primary',
                      //  'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
                      ].map((variant, idx) => (
                        <Alert key={idx} variant={variant}>
                          This is a {variant} alert—check it out!
                        </Alert>
                      ))
                    }
                  </div> */}

                  {this.state.shareModalIsOpen ?
                    <ModalForm
                      closeModal={this.closeModal}
                      isOpen={this.state.shareModalIsOpen}
                      handleSubmit={this.handleSubmit}
                      shared={this.state.alreadyShared} /> : null}

                  <Tabs className="file_space table"
                    defaultActiveKey="files" id="uncontrolled-tab-example">
                    <Tab eventKey="gallery" title="Shared images">


                      {(this.state.imageHashesShared.length !== 0) ? (
                        <div style={{ display: 'table-cell' }}>
                          <Table className="mb-5 mt-5 table" striped borderless hover variant="dark">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Image</th>
                                <th>From</th>
                                <th>Address</th>
                                <th>Date <button className="btn btn_reverse" type="button" onClick={() => this.reverseItems('image')}><BiSort size="1.2em" /></button></th>
                                <th></th>
                                <th></th>
                                <th></th>
                              </tr>
                            </thead>

                            {/* IMAGE DETAILS */}
                            {this.state.detailsModalIsOpen && fileType ?
                              <ModalDetails className='whitespace_wrap'
                                closeModal={this.closeDetailsModal}
                                isOpen={this.state.detailsModalIsOpen}
                                fileType={'image'}
                                detailType={'Image Details'}
                                height={this.state.height}
                                width={this.state.width}
                                filesize={this.state.filesize}
                                whoSharedWith={this.state.imageSharedWith}
                                gallery={false} />
                              : null}

                            <tbody>
                              {this.state.imageItems.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.id}</td>
                                  <td style={{ color: '#80C2AF' }}>{item.Name}</td>
                                  <td>
                                    {!this.state.viewOnlyImageArr[item.id] &&

                                      <img onClick={() => this.toggleModal(item.id)} className="img_shared" src={item.Image} alt="inputFile" />}

                                    {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
                                    {/* {this.state.viewOnlyImageArr[item.id] &&
                                      <ReactWaterMark
                                        waterMarkText={text}
                                        openSecurityDefense
                                        securityAlarm={beginAlarm}
                                        options={options}>
                                        <img onClick={() => this.toggleModal(item.id)} className="img_shared" src={item.Image} alt="inputFile" />
                                      </ReactWaterMark>} */}
                                    {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

                                    {this.state.viewOnlyImageArr[item.id] &&
                                      <ReactImageProcess onComplete={this.onComplete}
                                        mode="waterMark"
                                        waterMarkType="text"
                                        waterMark={item.Address}
                                        fontBold={false}
                                        fontSize={12}
                                        fontColor="#fff"
                                        coordinate={[5, 50]}>
                                        <img onClick={() => this.toggleModal(item.id)} className="img_shared" src={item.Image} alt="inputFile" />
                                      </ReactImageProcess>}

                                  </td>
                                  <td>{item.From}</td>
                                  <td>{item.Address}</td>
                                  <td> {item.Date}</td>
                                  <td>
                                    <button className="btn btn_download download_icon" type="button" onClick={() => this.openDetailsModal(item.id, 'image')}><RiInformationLine size="1.6em" /></button>
                                  </td>
                                  <td>{!this.state.viewOnlyImageArr[item.id] && <button className="btn btn_download download_icon" type="button" onClick={() => {
                                    if (item.Name.match(/.(gif)/i))
                                      this.downloadFile(item.Image, 'gif', item.Name);
                                    else
                                      this.downloadFile(item.Image, 'image', item.Name);
                                  }}><BiDownload size="1.8em" /></button>}
                                  </td>
                                  <td>{!this.state.viewOnlyImageArr[item.id] &&
                                    <button className="btn btn_download share_icon" type="button" onClick={() => this.openModal(item.id, 'image')}><RiUserShared2Line size="1.4em" /></button>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      ) : <h3 className='mt-5'>No images shared with you.</h3>}
                    </Tab>
                    <Tab eventKey="files" title="Shared files">

                      {(this.state.fileHashesShared.length !== 0) ? (
                        <div>
                          <Table className="mb-5 mt-5 table" striped borderless hover variant="dark">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>File</th>
                                <th>From</th>
                                <th>Address</th>
                                <th>Date <button className="btn btn_reverse" type="button" onClick={() => this.reverseItems('file')}><BiSort size="1.2em" /></button></th>
                                <th></th>
                                <th></th>
                                <th></th>
                              </tr>
                            </thead>

                            {/* FILE DETAILS */}
                            {this.state.detailsModalIsOpen && !fileType ?
                              <ModalDetails className='whitespace_wrap'
                                closeModal={this.closeDetailsModal}
                                isOpen={this.state.detailsModalIsOpen}
                                fileType={'file'}
                                type={'File name:         '}
                                detailType={'File Details'}
                                filesize={this.state.filesize}
                                whoSharedWith={this.state.fileSharedWith}
                                gallery={false} />
                              : null}

                            <tbody>
                              {this.state.items.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.id}</td>
                                  <td>
                                    {/* >>>>>>>>>>>>>>>>>>>>..... PDF VIEWER WITH WATERMARK <<<<<<<<<<<<<<<<<<<<<<< */}
                                    {this.state.viewOnlyFileArr[item.id] ?
                                      // CORRECT Opens in protected view
                                      // <a onClick={() => this.redirectToPDFViewer(item.File)} target="_blank" rel="noopener noreferrer" style={{ color: '#80C2AF' }}>{item.Name}</a>
                                      <button className="btn file_btn" onClick={() => this.redirectToPDFViewer(item.File)} target="_blank" rel="noopener noreferrer">{item.Name}</button>
                                      : <a href={item.File} target="_blank" rel="noopener noreferrer" style={{ color: '#80C2AF' }}>{item.Name}</a>}
                                  </td>
                                  <td>{item.From}</td>
                                  <td>{item.Address}</td>
                                  <td>{item.Date}</td>
                                  <td><button className="btn btn_download download_icon" type="button" onClick={() => this.openDetailsModal(item.id, 'file')}><RiInformationLine size="1.6em" /></button></td>
                                  <td>{!this.state.viewOnlyFileArr[item.id] && <button className="btn btn_download download_icon" type="button" onClick={() => {
                                    this.downloadFile(item.File, 'file', item.Name);
                                  }}><BiDownload size="1.8em" /></button>} </td>
                                  <td>{!this.state.viewOnlyFileArr[item.id] && <button className="btn btn_download ml-3 share_icon" type="button" onClick={() => this.openModal(item.id, 'file')}><RiUserShared2Line size="1.4em" /></button>}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      ) : <h3 className='mt-5'>No files shared with you.</h3>}
                    </Tab>
                  </Tabs>
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