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


      // <div className="gallery_bg">
      //   {(JSON.parse(localStorage.getItem('state'))) ?
      //     <div>
      //       <div className="top_gallery_space">


      //         <div className="container-fluid mt-4">
      //           <div className="row">
      //             <main role="main" className="col-lg-12 d-flex text-center">
      //               <div className="content mr-auto ml-auto">

      //                 <form className="input-group mt-3" onSubmit={this.onUpload} >
      //                   <input type="file" accept="application/pdf" onChange={this.captureFile} className="custom-file-input" /> {/* mx-sm-3 */}
      //                   <label className="custom-file-label radiu">{this.state.fileName}</label>
      //                   <button type='submit' className="btn submit_btn mt-4 container">Upload</button>
      //                 </form>

      //               </div>
      //             </main>
      //           </div>
      //         </div>
      //         <div className="space"></div>
      //       </div>

      //       <div className="container-fluid">
      //         <div className="row">
      //           <main role="main" className="col-lg-12 d-flex text-center">
      //             <div className="content mr-auto ml-auto">

      //               {(this.state.fileHashes.length !== 0) ? (
      //                 <div className="file_space">
      //                   <h4 className="mb-5">Your Files</h4>
      //                   {this.state.fileItems}
      //                 </div>
      //               ) : <h3>No files to display, try uploading one.</h3>}

      //               <div className="footer_space"></div>
      //             </div>
      //           </main>
      //         </div>
      //       </div>

      //     </div>
      //     : (<div className="top_gallery_space" >
      //       <h3>User not logged in to show files</h3>
      //     </div>)}
      // </div >
    );
  }
}

export default About;