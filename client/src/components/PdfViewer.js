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
      <div className="previous" onClick={this.handlePrevious}> <BiCaretLeft size="1.6em"/></div>;
    if (page === 1) {
      previousButton = <div className="previous disabled"> <BiCaretLeft size="1.6em" /></div>;
    }
    let nextButton = <div className="next" onClick={this.handleNext}> <BiCaretRight size="1.6em"/></div>;
    if (page === pages) {
      nextButton = <div className="next disabled"> <BiCaretRight size="1.6em"/></div>;
    }
    return (
      <nav>
        <button type='submit' disabled={this.state.disablePrevBtn} className="btn arrow_btn mb-1">{previousButton}</button>
        <button type='submit' disabled={this.state.disableNextBtn} className="btn arrow_btn mb-1">{nextButton}</button>
      </nav>
    );
  }

  applyWatermark = (canvas, context) => {
    context.globalAlpha = 0.20
    context.font = '35px  Arial'
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate(-Math.atan(canvas.height / canvas.width))

    // const text = 'Strictly Confidential. Not to be circulated' 0.30 (55/2) bold
    const text = JSON.parse(localStorage.getItem('address'))
    let metrics = context.measureText(text)
    context.fillText(text, -metrics.width / 2, (5 / 2))

    let text2 = 'View Only'
    let metrics2 = context.measureText(text2)
    context.fillText(text2, -metrics2.width / 2, (55 / 2))
  }

  render() {
    let pagination = null;
    if (this.state.pages) {
      pagination = this.renderPagination(this.state.page, this.state.pages);
    }
    return (
      <div style={{ backgroundColor: '#222' }}>
        <PDF className="mt-4"
          file={JSON.parse(localStorage.getItem('item'))}
          page={this.state.page}
          watermark={this.applyWatermark}
          // onDocumentComplete={() => { /* Do anything on document loaded like remove loading, etc */ }}
          onPageRenderComplete={(pages, page) => this.setState({ page, pages })}
        />
        {pagination}
      </div>
    )
  }
}

export default PdfViewer;