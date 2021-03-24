import React from 'react';
import PDF from 'react-pdf-watermark';
import { BiCaretRight, BiCaretLeft } from "react-icons/bi";

class PdfViewer extends React.Component {
  state = {};

  handlePrevious = () => {
    this.setState({ page: this.state.page - 1 });
  }

  handleNext = () => {
    this.setState({ page: this.state.page + 1 });
  }

  renderPagination = (page, pages) => {
    let previousButton =
      <div className="previous" onClick={this.handlePrevious}> <BiCaretLeft size="1.6em" /></div>;
    if (page === 1) {
      previousButton = <div className="previous disabled"> <BiCaretLeft size="1.6em" /></div>;
    }
    let nextButton = <div className="next" onClick={this.handleNext}> <BiCaretRight size="1.6em" /></div>;
    if (page === pages) {
      nextButton = <div className="next disabled"> <BiCaretRight size="1.6em" /></div>;
    }
    return (
      <nav>
        <button id='previous-btn' type='submit' disabled={this.state.disablePrevBtn} className="btn arrow_btn mb-1">{previousButton}</button>
        <button id='next-btn' type='submit' disabled={this.state.disableNextBtn} className="btn arrow_btn mb-1">{nextButton}</button>
      </nav>
    );
  }

  applyWatermark = (canvas, context) => {
    context.globalAlpha = 0.20
    context.font = '35px  Arial'
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate(-Math.atan(canvas.height / canvas.width))

    const text = JSON.parse(localStorage.getItem(this.props.location.search.replace('?', '')))[1]
    let metrics = context.measureText(text)
    context.fillText(text, -metrics.width / 2, (95 / 2))

    let text2 = 'View Only'
    let metrics2 = context.measureText(text2)
    context.fillText(text2, -metrics2.width / 2, (0 / 2))
  }

  render() {
    let fileLoaded;
    if (JSON.parse(localStorage.getItem(this.props.location.search.replace('?', ''))) === null)
      fileLoaded = false
    else
      fileLoaded = true

    let pagination = null;
    if (this.state.pages) {
      pagination = this.renderPagination(this.state.page, this.state.pages);
    }
    return (
      <div className="simple_bg small_top_space">
        {(JSON.parse(localStorage.getItem('state'))) ? (

          <div>
            {fileLoaded ?
              <div>
                <PDF file={JSON.parse(localStorage.getItem(this.props.location.search.replace('?', '')))[0]}
                  page={this.state.page}
                  watermark={this.applyWatermark}
                  onPageRenderComplete={(pages, page) => this.setState({ page, pages })} />
                {pagination}
              </div>
              : <h3 id='file-not-chosen' className="mt-5">File not chosen to display.</h3>}
          </div>
        ) : <h3 id='user-not-logged-in' className="mt-5">User not logged in.</h3>}
      </div>
    );
  }
}

export default PdfViewer;