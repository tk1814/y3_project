import React, { Component } from 'react';
import bs58 from 'bs58';
import Web3 from "web3";
import Meme from '../contracts/Meme.json';
import Carousel, { Modal, ModalGateway } from 'react-images';
import { BiDownload } from "react-icons/bi";
import { Table } from 'react-bootstrap';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

class Sharepoint extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      imageItems: [],
      imageHashesShared: [],
      imageNameSolArray: [],
      imageNamesSharedSolArray: [],
      addressSharedwithUserSolArray: [],
      usernameSharedWithUserSolArray: [],
      dateSharedImage: [],
      fileHashesNotShared: [],
      fileHashesShared: [],
      fileNamesSharedSolArray: [],
      fileAddressSharedwithUserSolArray: [],
      fileUsernameSharedWithUserSolArray: [],
      dateSharedFile: [],
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      modalIsOpen: false,
      img_index: 0,
      image_shared_src: [],
      file_shared_src: []
    }

    // this.toggleModal = this.toggleModal.bind(this);
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

        // LOAD Shared images array
        let imageSharedSolArray, imageNamesSharedSolArray, addressSharedwithUserSolArray, usernameSharedWithUserSolArray, dateSharedImage;
        await contract.methods.getSharedImageArr().call({ from: this.state.account }).then((r) => {
          imageSharedSolArray = r[0]
          imageNamesSharedSolArray = r[1]
          addressSharedwithUserSolArray = r[2]
          usernameSharedWithUserSolArray = r[3]
          dateSharedImage = r[4]

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
            this.setState({ imageHashesSharedItems: imageHashesSharedItems })

            let image_shared_src = [];
            let hashes = this.state.imageHashesShared.map((image, index) =>
              `https://ipfs.infura.io/ipfs/${image}`)

            for (let i = 0; i < hashes.length; i++) {
              image_shared_src.push({ source: hashes[i] })
            }
            this.setState({ image_shared_src: image_shared_src })

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
        let fileSharedSolArray, fileNamesSharedSolArray, fileAddressSharedwithUserSolArray, fileUsernameSharedWithUserSolArray, dateSharedFile;
        await contract.methods.getSharedFileArr().call({ from: this.state.account }).then((r) => {
          fileSharedSolArray = r[0]
          fileNamesSharedSolArray = r[1]
          fileAddressSharedwithUserSolArray = r[2]
          fileUsernameSharedWithUserSolArray = r[3]
          dateSharedFile = r[4]

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
            this.setState({ file_shared_src: file_shared_src })

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

  renderItem(item, index) {
    return (
      <tr key={index}>
        <td>{item.id}</td>
        <td><a href={item.File} target="_blank" rel="noopener noreferrer" style={{ color: '#80C2AF' }}>{item.Name}</a></td>
        <td>{item.From}</td>
        <td>{item.Address}</td>
        <td>{item.Date}</td>
      </tr>
    )
  };    

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
                        <Carousel
                          currentIndex={this.state.img_index}
                          views={this.state.image_shared_src}
                          styles={{
                            container: base => ({ ...base, height: '100vh', }),
                            view: base => ({
                              ...base, alignItems: 'center', display: 'flex ', height: 'calc(100vh - 54px)', justifyContent: 'center',
                              '& > img': { maxHeight: 'calc(100vh - 94px)', },
                            })
                          }} />
                      </Modal>
                    ) : ''}
                  </ModalGateway>
                  <div className="smaller_space"></div>


                  <Tabs className="file_space table"
                    defaultActiveKey="gallery" id="uncontrolled-tab-example">
                    <Tab eventKey="gallery" title="Shared images">

                      {(this.state.imageHashesShared.length !== 0) ? (
                        <div style={{display: 'table-cell'}}>
                    
                          <Table className="mb-5 mt-5 table" striped bordered hover variant="dark">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Image</th>
                                <th>From</th>
                                <th>Address</th>
                                <th>Date</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>

                              {this.state.imageItems.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.id}</td>
                                  <td style={{ color: '#80C2AF' }}>{item.Name}</td>
                                  <td>{<img onClick={() => this.toggleModal(index)} className="img_shared" src={item.Image} alt="inputFile" />} </td>
                                  <td>{item.From}</td>
                                  <td>{item.Address}</td>
                                  <td> {item.Date}</td>
                                  <td><button className="btn btn_download download_icon" type="button" onClick={() => {
                                    if (item.Name.match(/.(gif)/i))
                                      this.downloadFile(item.Image, 'gif', item.Name);
                                    else
                                      this.downloadFile(item.Image, 'image', item.Name);
                                  }}><BiDownload size="1.8em" /></button></td>
                                </tr>
                              ))}

                            </tbody>
                          </Table>

                        </div>
                      ) : <h3 className='mt-5'>No images shared with you.</h3>}

                    </Tab>
                    <Tab eventKey="files" title="Shared files table">

                      {(this.state.fileHashesShared.length !== 0) ? (
                        <div>

                          <Table className="mb-5 mt-5 table" striped bordered hover variant="dark">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>File</th>
                                <th>From</th>
                                <th>Address</th>
                                <th>Date</th>
                              </tr>
                            </thead>

                            <tbody>
                              {this.state.items.map(this.renderItem)}
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