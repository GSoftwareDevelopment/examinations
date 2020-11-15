import React, { Component } from 'react'
import { observer } from 'mobx-react';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';

import * as Icon from 'react-bootstrap-icons';

import GroupsStore from '../../stores/groups';

class AddGroup extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            name: '',
            description: '',
            uniqueName: true
        }
    }

    setInputValue ( property, val ) {
        val = val.trim();
        this.setState( { [ property ]: val } );
    }

    async onSubmit ( e ) {
        e.preventDefault();
        e.stopPropagation();

        if ( this.state.name.length === 0 ) {
            return
        }

        const result = await GroupsStore.fetchAdd( {
            name: this.state.name,
            description: this.state.description
        } );

        if ( result.OK ) {
            console.log( 'Group is added' )
            this.props.onHide();
        }

        if ( result.error && result.error.name === "ValidatorError" ) {
            switch ( result.error.kind ) {
                case "unique":
                    this.setState( { uniqueName: false } );
                    return
                default:
                    console.error( result );
            }
        }
        return;

    }

    render () {
        return (
            <Modal {...this.props} backdrop="static">
                <Form onSubmit={( e ) => { this.onSubmit( e ); }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Nowa grupa badań</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Nazwa grupy</Form.Label>
                            <Form.Control
                                type="name"
                                onChange={( e ) => { this.setInputValue( 'name', e.target.value ) }}
                            />
                            {!this.state.uniqueName &&
                                <div className="custom-feedback text-danger small">
                                    <Icon.ExclamationCircleFill className="mr-2" />
                                Grupa o podanej nazwie już istnieje.
                            </div>}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Opis</Form.Label>
                            <Form.Control
                                as="textarea"
                                row={3}
                                onChange={( e ) => { this.setInputValue( 'description', e.target.value ) }}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={( this.state.name.length === 0 || GroupsStore.getState() === 'pending' )}>
                            {GroupsStore.getState() === 'pending'
                                ? <div className="d-flex felx-row align-items-center">
                                    <Spinner size="sm" animation="border" role="status" /><span className="ml-2">Zapisywanie...</span>
                                </div>
                                : "Utwórz"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

export default observer( AddGroup )