import React, { Component } from 'react';
import './App.css';
import { FaEthereum, FaCanadianMapleLeaf } from "react-icons/fa";
import { FcDocument, FcLock, FcStackOfPhotos, FcShare, FcSalesPerformance } from "react-icons/fc";
import { IoLogoBitcoin } from "react-icons/io";
import { BiEuro, BiPound, BiDollar } from "react-icons/bi";
import { CgSwiss } from "react-icons/cg"; 
import { GiAustralia } from "react-icons/gi"; 

class Root extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: null
    }
  }

  loadData = () => {
    const { getEthPriceNow } = require('get-eth-price');

    this.setState({ last_update: Date().toLocaleString() })
    getEthPriceNow().then(data => {

      let values = JSON.parse(JSON.stringify(data));
      let arr = [];
      Object.keys(values).forEach(function (key) { arr.push(values[key]); });
      let prices = JSON.stringify(arr[0]).slice(8, -2).replace(/['"]+/g, '').split(',')

      let prices_els = prices.map((item, index) => (
        <div className='prices price_box ' key={index}>

          <h5 className='mb-3 mt-3 mr-3 ml-3 '>
            {index === 0 && <IoLogoBitcoin size="2em" />}
            {index === 1 && <BiDollar size="2em" />} 
            {index === 2 && <BiEuro size="2em" />} 
            {index === 3 && <GiAustralia size="2em" />} 
            {index === 4 && <CgSwiss size="2em" />} 
            {index === 5 && <FaCanadianMapleLeaf size="2em" />} 
            {index === 6 && <BiPound size="2em" />} 
            <br></br>
            {item.replace(':', ': ')} 
            
            </h5> 
        </div>
      ))
      this.setState({ prices_els })
    });
  }

  async componentDidMount() {

    // get real time prices every 20 seconds
    this.loadData();
    setInterval(() => {
      this.loadData();
    }, 20000);
  }

  render() {
    return (
      <div className="general_bg">
        <div className="top_space">
          <h4>Simpler Safer Faster</h4>
          <h3 className="mt-4">Storing files on Ethereum has never been easier.</h3>
          {(JSON.parse(localStorage.getItem('state'))) ?
            <a id="start-btn" href="/gallery" className="btn start_btn mt-5" role="button">Get Started</a>
            : <a id="start-btn" href="/login" className="btn start_btn mt-5" role="button">Get Started</a>}
        </div>

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto white-text">
                <br></br>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>

                <div style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', fontWeight: 'bold', fontSize: '1.15em' }}>
                  <h1 className='mr-5'> <FcStackOfPhotos size="5em" /> <br></br><br></br> Upload images</h1>
                  <h1 className='mr-5'> <FcDocument size="5em" /> <br></br><br></br> Store documents</h1>
                  <h1 className='mr-5' > <FaEthereum style={{ color: '#6e967a' }} size="5em" /> <br></br><br></br> Interact with ethereum</h1>
                  <h1 className='mr-5'> <FcShare size="5em" /> <br></br><br></br> Share certificates</h1>
                  <h1 className='mr-5'> <FcLock size="5em" /> <br></br><br></br> Secure your files</h1>
                </div>
                <p>&nbsp;</p>
                <p>&nbsp;</p>

                <div className='small_space mb-5'>
                  <div className='h7 mb-3 mt-5'>CURRENT ETH PRICE (1 ether) <FcSalesPerformance size="2em" /></div>
                  {this.state.prices_els}
                  <h6 className='mt-4 '>Last updated: {this.state.last_update}</h6>
                </div>
                <div className='smaller_space'></div>
              </div>
            </main>
          </div>
        </div>
      </div >
    )
  }
};

export default Root;