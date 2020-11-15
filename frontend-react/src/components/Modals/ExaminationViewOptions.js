import React, { Component } from 'react'
import { Button, Modal } from 'react-bootstrap';

class ExaminationViewOptions extends Component {
    doSaveOption () {
        this.props.onHide();
    }

    render () {
        return (
            <Modal {...this.props} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Opcje widoku listy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { this.doSaveOption(); }}>
                        Zastosuj
                    </Button>
                    <Button variant="secondary" onClick={this.props.onHide}>
                        Zamknij
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ExaminationViewOptions