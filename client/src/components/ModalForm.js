import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/button'
import React, { Component } from 'react'

export default class ModalForm extends Component {

  state = { name: null }

  handleChange = (e) => this.setState({ name: e.target.value })

  render() {
    return (

      <div>

        <Modal className='modal'
          show={this.props.isOpen}
          onHide={this.props.closeModal}
        >
          <Modal.Header closeButton>
            <Modal.Title className='white-text'>Share File</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group >
              <Form.Label className='white-text'>Enter Public Address: </Form.Label>
              <Form.Control className='input_box' type="text" onChange={this.handleChange} value={this.state.name} placeholder="" size="50" maxLength="42" required />
              <br></br>
              {this.props.shared && <Form.Label className='err'>You have already shared this file with that user.</Form.Label>}

            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {!this.props.shared && <Button className='btn share_btn shadow-none' type="submit" onClick={() => this.props.handleSubmit(this.state.name)}>
              Share
          </Button>}

          </Modal.Footer>
        </Modal>

      </div>
    )
  }
}