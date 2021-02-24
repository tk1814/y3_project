import React, { Component } from 'react';
import bs58 from 'bs58';
import Web3 from "web3";
import Meme from '../contracts/Meme.json';
import moment from "moment"
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      fileName: 'Choose a pdf file',
      fileItems: [],
      fileHashes: [],
      fileNameSolArray: [],
      dateUpload: [],
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      modalIsOpen: false,
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

        let fileSolArray, fileNameSolArray, username, dateUpload;
        await contract.methods.getFile().call({ from: this.state.account }).then((r) => {
          fileSolArray = r[0];
          fileNameSolArray = r[1]
          username = r[2]
          dateUpload = r[3]
        })

        if (username !== undefined) {
          this.setState({ username })
        }

        if (dateUpload !== undefined) {
          this.setState({ dateUpload })
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
                <Page pageNumber={1} scale={0.3} />
              </Document>

              <a style={{ color: '#80C2AF' }} href={`https://ipfs.infura.io/ipfs/${file}`} target="_blank" rel="noopener noreferrer">{Web3.utils.hexToAscii(this.state.fileNameSolArray[index])}</a>
              <p>{this.state.dateUpload[index]}</p>
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
  onUpload = async (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")

    let buffer_data = this.state.buffer
    if (buffer_data) {
      try {
        const file = await ipfs.add(this.state.buffer)
        let file_hash = file.path // https://bafybeicr32sjoeiv34hifs5gc7pqeuyjp7b67rauwf3y5uf7pkii6vx3ei.ipfs.infura-ipfs.io/ //46   QmTrEe3qpoBwmfuCvEsdFpA7opMhAWrrW3cQ1azqz2t9XF

        // check if hash exists so the user does not pay to re-execute the contract
        if (this.state.fileHashes.find(file_itm => file_itm === file_hash)) {
          alert('This file already exists. Please select a different one.');
        } else {

          let hash_decoded = bs58.decode(file_hash).slice(2); // 32 to be stored.toString()
          // let shorten_filename = this.state.fileName.slice(0, -4);
          let shorten_filename = this.state.fileName;

          let hex_filename = Web3.utils.asciiToHex(shorten_filename)
          if (hex_filename.length > 66)
            alert("File name is too large to be stored in the blockchain, please try a shorter name.")
          else {

            // dateUpload
            await this.state.contract.methods.setFile(hash_decoded, hex_filename, moment().format('DD-MM-YYYY HH:mm')).send({ from: this.state.account }).then((r) => {
              // refresh to get the new file array with get() of smart contract
              window.location.reload();
            })

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

                      <form className="input-group mt-3" onSubmit={this.onUpload} >
                        <input type="file" accept="application/pdf" onChange={this.captureFile} className="custom-file-input" /> {/* mx-sm-3 */}
                        <label className="custom-file-label radiu">{this.state.fileName}</label>
                        <button type='submit' className="btn submit_btn mt-4 container">Upload</button>
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

                    {(this.state.fileHashes.length !== 0) ? (
                      <div className="file_space">
                        <h4 className="mb-5">Your Files</h4>
                        {this.state.fileItems}
                      </div>
                    ) : <h3>No files to display, try uploading one.</h3>}



                    <div className="footer_space"></div>
                  </div>
                </main>
              </div>
            </div>

          </div>
          : (<div className="top_gallery_space" >
            <h3>User not logged in to show files</h3>
          </div>)}
      </div >
    );
  }
}

export default Gallery;