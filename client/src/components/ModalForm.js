import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/button'
import React, { Component } from 'react'

export default class ModalForm extends Component {

  state = {
    name: '',
    viewOnly: false
  }

  handleChange = (e) => this.setState({ name: e.target.value })

  handleViewOnly = (e) => this.setState(state => ({ viewOnly: !state.viewOnly }))

  render() {
    return (

      <div>

        <Modal className='modal'
          show={this.props.isOpen}
          onHide={this.props.closeModal}>

          <Modal.Header closeButton>
            <Modal.Title className='white-text'>Share File</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group >
              <Form.Label className='white-text'>Enter Public Address: </Form.Label>
              <Form.Control id='input-address' className='input_box' type="text" onChange={this.handleChange} value={this.state.name} placeholder="" size="50" maxLength="42" required />

              <br></br>
              <input className='ml-1' type="checkbox" id="agree" onChange={this.handleViewOnly} />
              <label htmlFor="agree" style={{ textIndent: '0.5em' }}><p> View Only</p></label>

              <br></br>
              {this.props.shared && <Form.Label className='err'>You have already shared this file with that user.</Form.Label>}

            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {/* {!this.props.shared &&  */}
            <Button id='share-file' className='btn share_btn shadow-none' type="submit" onClick={() => this.props.handleSubmit(this.state.name, this.state.viewOnly)}>
              Share
          </Button>
          {/* } */}

          </Modal.Footer>
        </Modal>

      </div>
    )
  }
}