import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Search from './components/Search';
import About from './components/About';
import Contact from './components/Contact';
import { BrowserRouter, Switch, Route } from 'react-router-dom' // Link
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'; // NavbarText
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearchPlus, faHome, faSignOutAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import Web3 from "web3";
import Meme from './contracts/Meme.json';
import bs58 from 'bs58';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 

const Root = () => (
  <div> 
  <h2>Home</h2>
  </div>
);

class App extends Component {

  // TO DO 1.0: Authenticate user and acc
  // TO DO 1.3: avoid duplicate images in smart contract? preferably
  // TO DO 1.5: fix image layout, create mapping Image name->image
  // TO DO 1.7: create more components and fix implications from this
  // TO DO 2.0: fix internal/abstract function definitions in smart contract
  // TO DO 3.0: Create footer
  // TO DO 4.0: Create circular logo

  constructor(props) {
    super(props)

    this.state = {
      imageItems: [],
      fileName: 'Choose file',
      memeHash: '',
      imageArr: [],
      contract: null,
      web3: null,
      buffer: null,
      account: null
    }
  }

  // Lifecycle
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
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

    if(networkData) { 
      const contract = new web3.eth.Contract(Meme.abi, networkData.address)
      this.setState({ contract })
      // const memeHash = await contract.methods.get().call()    // GETS
      // this.setState({ memeHash })

      // ***********&&&&&&&&&&&&************
      // Display all images 
      let imageSolArray = await contract.methods.get().call() 
      console.log(imageSolArray)

      if (imageSolArray !== undefined) {
        console.log('Did the hashes, imageArr is ready to display')

        let imageHashes = imageSolArray.slice();
        imageSolArray.forEach(function(item, index) {
          let hashHex = "1220" + item.slice(2)
          let hashBytes = Buffer.from(hashHex, 'hex');
          let hashStr = bs58.encode(hashBytes)
          imageHashes[index] = hashStr;

        });

        // imageHashes.forEach(item => {
        //   console.log('item ', item)
        // });

        this.setState({imageArr: imageHashes})

        let imageItems
        imageItems = this.state.imageArr.map((image,index) => (
          <div key={index}>
          <img style={{height:"100px"}} src={`https://ipfs.infura.io/ipfs/${image}`} alt="inputFile"/> 
          </div>
        ))
        this.setState({imageItems: imageItems})
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  // this method is called whenever a file is uploaded
  // gets uploaded file and converts it to appropriate format for IPFS
  // stores the file in this component's state
  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]     // access file from user input
    const fileName = event.target.files[0].name;
    this.setState({ fileName: fileName }) 
    console.log(fileName);
    const reader = new window.FileReader() // convert file to array for buffer
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
        let file_hash = file.path // https://gateway.ipfs.io/ipfs/QmUaEA7Yt8Nx824hbkAHhABDWULnGcuKiXC7AECGkzMY72 //46
     
        let hash_decoded = bs58.decode(file_hash).slice(2);
        console.log('Bytes32/store: ' + hash_decoded.toString('hex')) // 32 length
        this.state.contract.methods.set(hash_decoded).send({ from: this.state.account }).then((r) => {
          // return this.setState({ memeHash: file_hash }) 
          this.setState({ memeHash: file_hash }) 
          // ***************&&&&&&&&&&&&************
          // add refresh or sg to get the new image array from get() of smart contract
          window.location.reload();
        })
        
      } catch(e) {
          console.log("Error: ", e)
      }
    } else {
        alert("No file was submitted. Please try again.")
        console.log('ERROR: No data to submit')
    }
  } 
  
  render() {
  
  // if (!this.state.loading) {
      // let { images } = this.state.imageArr
      // let imageItems
      // if (images === undefined) {
      //   console.log('undefined')
      //   imageItems = <h4>No images found</h4>
      // } else {
      //   console.log('not undefined');
      //   if (images.size > 0) {
      //     imageItems = images.map((image) => (
      //       <img style={{height:"100px"}} src={`https://ipfs.infura.io/ipfs/${image}`} alt="inputFile"/> 
      //     ))
      //   } 
      // }
  // } else return "Loading image Array...";

    return (
      <div className="App" data={this.state}>
        <BrowserRouter>  
          <main>
            <Navbar className="nav" expand="md">
              <NavbarBrand href="/"><Header subtitle="Credential Store"/></NavbarBrand>
              <Nav className="mr-auto" navbar></Nav>
              <NavItem>
                <NavLink className="mr-auto" href="/"><FontAwesomeIcon icon={faHome} style={{color:"#9AEDED"}} size="2x"/></NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/search/"><FontAwesomeIcon icon={faSearchPlus} style={{color:"#9AEDED"}} size="2x"/></NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/contact"><FontAwesomeIcon icon={faPaperPlane} style={{color:"#9AEDED"}} size="2x"/></NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/about"><FontAwesomeIcon icon={faSignOutAlt} style={{color:"#9AEDED"}} size="2x"/></NavLink>
              </NavItem>
            </Navbar>     
            <Switch>
                <Route exact path='/' component={Root} />
                <Route path='/search' component={Search} />  
                <Route path='/contact' component={Contact} />
                <Route path='/about' component={About} />
            </Switch>
          </main> 
        </BrowserRouter>

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <p>&nbsp;</p>
                <form className="input-group" onSubmit={this.onSubmit} >
                    <input type="file" accept="image/*" onChange={this.captureFile} className="custom-file-input mx-sm-3" />
                    <label className="custom-file-label">{this.state.fileName}</label>
                    <button type='submit' style={{backgroundColor:"#222", color:"#9AEDED", fontSize:"1.5em" }} className="btn mt-3 container">Submit</button>
                </form>
                <p>&nbsp;</p>
                {this.state.imageItems}
                <br></br>
                <br></br>
              </div>
            </main>
          </div>
        </div>

      </div>
    );
  }


}

export default App;

// class App extends Component {

//   constructor(props) {
//     super(props);
//     this.ethereum = window.ethereum
//     this.state = {
//       storageValue: 0,
//       web3: null,
//       accounts: null,
//       contract: null,
//       buffer: null,
//       ipfsHash: '',
//       loading: true, 
//       drizzleState: null
//     };
//   }

//   // componentDidMount() {
//   //   this.interval = setInterval(() => {
//   //   this.connectToMetamask()}, 1000); 

//   //   console.log('after repeatition'); // does drizzle work after repetition %%%%%%%%%%%%%%%%%%%%%
    
//   //   const { drizzle } = this.props;
//   //   // subscribe to changes in the store
//   //   this.unsubscribe = drizzle.store.subscribe(() => {
//   //   // every time the store updates, grab the state from drizzle
//   //   const drizzleState = drizzle.store.getState();
//   //   // check to see if it's ready, if so, update local component state
//   //       if (drizzleState.drizzleStatus.initialized) {
//   //         this.setState({ loading: false, drizzleState });
//   //       }
//   //   });
//   // }

//   // compomentWillUnmount() {
//   //   clearInterval(this.interval);
//   //   this.unsubscribe();
//   // }

//   componentDidMount = async () => {
//       // Get network provider and web3 instance.
//       // const web3 = await getWeb3(); ///oops
//       // const web3 = new Web3(window.web3.currentProvider)

//       let accountAddress;
//       this.ethereum = window.ethereum
//       if (this.ethereum) {
//         // prompts the user to login with MM
//         window.ethereum.enable(); // important: do not change window.eth
//         console.log('Window: '+ window.ethereum.selectedAddress)
//         accountAddress = window.ethereum.selectedAddress;
//         this.ethereum.on('accountsChanged', function (accounts) {
//           accountAddress = accounts[0]
//           console.log('ACOUNT CHANGED - new address: '+ accountAddress)
//           window.location.reload();
//         })
//       }

//       const { drizzle } = this.props;
//       // subscribe to changes in the store
//       this.unsubscribe = drizzle.store.subscribe(() => {
//       // every time the store updates, grab the state from drizzle
//       const drizzleState = drizzle.store.getState();
//       // check to see if it's ready, if so, update local component state
//           if (drizzleState.drizzleStatus.initialized) {
//             this.setState({ loading: false, drizzleState });
//           }
//       });
//   };

//   retrieveFile = async () => {  
//     // const { accounts, contract } = this.state;
//     // // Get the value from the contract to prove it worked.
//     // const ipfsHash = await contract.methods.get().call();
//     // // Update state with the result.
//     // this.setState({ ipfsHash: ipfsHash });
//   };

//   compomentWillUnmount() {
//     this.unsubscribe();
//   }
  
//   connectToMetamask = () => {
//     // gets ethereum account - when reloads it receives new window.ethereum
//     this.ethereum = window.ethereum

//     if (this.ethereum) {
//       // prompts the user to login with MM
//       window.ethereum.enable(); // important: do not change window.eth
//       console.log('Window: '+ window.ethereum.selectedAddress)

//       this.ethereum.on('accountsChanged', function (accounts) {
//         let accountAddress = accounts[0]
//         console.log('ACOUNT CHANGED - new address: '+ accountAddress)

//         // if (addr !== undefined) 
//         // this.setState({ accountAddress: addr }) // when disconnecting setState is not a function
//         window.location.reload();
//       })
//     }
//   }


//   render() {
//     // if (this.state.loading) return "Loading Drizzle...";
//     // if (!this.state.web3) {
//     //   return <div>Loading Web3, accounts, and contract...</div>;
//     // }
//     return (
      
//       <div className="App">
//         <BrowserRouter>  
//         <main>
//           <Navbar className="nav" expand="md">
//               <NavbarBrand href="/"><Header subtitle="Credential Store"/></NavbarBrand>
//                 <Nav className="mr-auto" navbar></Nav>
//                 <NavItem>
//                   <NavLink className="mr-auto" href="/"><FontAwesomeIcon icon={faHome} style={{color:"#9AEDED"}} size="2x"/></NavLink>
//                 </NavItem>
//                 <NavItem>
//                   <NavLink href="/search/"><FontAwesomeIcon icon={faSearchPlus} style={{color:"#9AEDED"}} size="2x"/></NavLink>
//                 </NavItem>
//                 <NavItem>
//                   <NavLink href="/contact"><FontAwesomeIcon icon={faPaperPlane} style={{color:"#9AEDED"}} size="2x"/></NavLink>
//                 </NavItem>
//                 <NavItem>
//                   <NavLink href="/about"><FontAwesomeIcon icon={faSignOutAlt} style={{color:"#9AEDED"}} size="2x"/></NavLink>
//                 </NavItem>
//             </Navbar>     
//             <Switch>
//                 <Route exact path='/' component={Root} />
//                 <Route path='/search' component={Search} />
//                 <Route path='/about' component={About} />
//                 <Route path='/contact' component={Contact} />
//             </Switch>
//             </main> 
//         </BrowserRouter>

//       <div>

//         {/* <h1 className="App-title">Welcome to CS <br></br>(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</h1>
//         {this.ethereum && <p>Your ethereum address: {this.ethereum.selectedAddress} </p>} 
//         {!this.ethereum && <p style={{color: 'red'}}>Please use browser with Ethereum wallet (install MetaMask) </p>}
//         <ReadSum drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />
//         <SetSum drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}  /> */}
   

//     <br></br>
//     1. Shrek<br></br>

//     <h1>Your Image</h1>
//         <p>This image is stored on IPFS & Ethereum blockchain!</p>
//         <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="" />
//         <h2>Upload Image</h2>
//         <form onSubmit={this.onSubmit}>
//           <input type='file' onChange={this.captureFile}/>
//           <input type='submit' />
//         </form>

//       </div>
//       </div>
//     );
//   }


// }

// export default App;