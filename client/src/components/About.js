import React, { Component } from 'react';

class About extends Component {
  constructor(props) {
    super(props)

    this.state = {
      account: null
    }
  }

  async componentDidMount() {

    // Detects metamask eth wallet account change 
    this.ethereum = window.ethereum
    if (this.ethereum) {
      this.ethereum.on('accountsChanged', function (accounts) {
        this.setState({ account: accounts[0] })
        localStorage.setItem('state', JSON.stringify(false));
        localStorage.setItem('item', JSON.stringify(''));
        localStorage.setItem('address', JSON.stringify(''));
        window.location.reload();
      }.bind(this))
    }
  }

  render() {
    return (

      <div className="about_bg">
        <div className="small_top_space"></div>

        <h4 className="">How To </h4>

        <div className="middle_about_space"></div>

        <h3 className="mt-3">1. Log in to your Metamask account </h3>
        <h3 className="mt-3">2.Enter your username to sign up</h3>
        <h3 className="mt-3">3.Upload and share your files </h3>

      </div >
    );
  }
}

export default About;