import React, { Component } from 'react';

class About extends Component {
  constructor(props) {
    super(props)

    this.state = {
      account: null
    }
  }

  render() {
    return (

      <div className="about_bg">
        <div className="small_top_space"></div>

        <div className="h9">How to access the application</div>
        <div className="middle_about_space"></div>

        <div className="mt-3 h8">1. Download the Metamask plugin <a style={{color: '#6e967a'}} href='https://metamask.io/download' target="_blank" rel="noopener noreferrer">here</a> </div>
        <div className="mt-3 h8">2. Create a MetaMask account </div>
        <div className="mt-3 h8">3. Add funds to your account </div>
        <div className="mt-3 h8">4. Go to the Login page and enter your username to sign up</div>
        <div className="mt-3 h8">5. You are ready to upload and share your files </div>

      </div >
    );
  }
}

export default About;