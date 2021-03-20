import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import React, { Component } from 'react'

export default class ModalDetails extends Component {

  render() {
    return (

      <Modal className='modal'
        show={this.props.isOpen}
        onHide={this.props.closeModal} >
        <Modal.Header id='details-modal-header' closeButton>
          <Modal.Title className='white-text'>{this.props.detailType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group >
            {this.props.gallery && <div><Form.Label className='white-text whitespace_wrap'>{this.props.type} {this.props.fileName}</Form.Label><br></br></div>}

            {this.props.fileType === 'image' && <div><Form.Label className='white-text whitespace_wrap'>Dimensions:      {this.props.height} x {this.props.width}</Form.Label><br></br></div>}

            <div><Form.Label className='white-text whitespace_wrap'>Size:                   {this.props.filesize}</Form.Label><br></br></div>

            {this.props.gallery && <div><Form.Label className='white-text'>Date uploaded: {this.props.fileDate}</Form.Label><br></br></div>}

            {this.props.fileType === 'image' && <div><Form.Label className='white-text'>Shared with: {this.props.whoSharedWith.map((itm, index) => (<li key={index}>{itm}</li>))}</Form.Label><br></br></div>}

            {this.props.fileType === 'file' && <Form.Label className='white-text'>Shared with: {this.props.whoSharedWith.map((itm, index) => (<li key={index}>{itm}</li>))}</Form.Label>}

          </Form.Group>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>

    )
  }
}