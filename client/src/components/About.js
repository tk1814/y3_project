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