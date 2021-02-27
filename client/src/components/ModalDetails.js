import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/button'
import React, { Component } from 'react'

export default class ModalDetails extends Component {

  render() {
    return (

      <Modal className='modal'
        show={this.props.isOpen}
        onHide={this.props.closeModal} >
        <Modal.Header closeButton>
          <Modal.Title className='white-text'>File Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group >
            <Form.Label className='white-text'>File name: {this.props.fileName}</Form.Label>
            <br></br>
            <Form.Label className='white-text'>Date uploaded: {this.props.fileDate}</Form.Label>

          </Form.Group>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>

    )
  }
}