import React, { Component } from 'react'
import { Modal, Button, Form } from 'react-bootstrap';

import AttrGeneral from './Value/AttrGeneral';
import ValueAttributes from './Value/ValueAttributes';

class EditValue extends Component {
    constructor( props ) {
        super( props );
        let { id, type, name, description, required, ...attributes } = props.valueData;
        description = description || '';
        this.state = {
            id,
            type,
            general: {
                name,
                description,
                required
            },
            attributes,
        }
    }

    isValid () {
        if ( this.state.type === 'DEFAULT' )
            return false

        if ( this.state.general && this.state.general.name.trim() === '' )
            return false

        return true
    }

    onSubmit ( e ) {
        e.preventDefault();
        e.stopPropagation();

        if ( this.isValid() ) {
            const { name, description, required } = this.state.general;
            let newValue = {
                type: this.state.type,
                name,
                description,
                required,
            }

            const attr = this.state.attributes;
            if ( attr === null ) {
                console.log( 'Something wrong with attributes!!' )
                return;
            }

            switch ( this.state.type ) {
                case "numeric":
                    newValue[ 'unit' ] = attr.unit;
                    break;
                case "enum":
                case "sets":
                    newValue[ 'list' ] = [ ...attr.items ];
                    break;
                default:
                    break;
            }
            this.props.onUpdate( this.state.id, newValue );
            this.props.onHide();
        }
    }

    render () {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} backdrop="static">
                <Form onSubmit={( e ) => { this.onSubmit( e ); }}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edycja definicji:
                                <span className="ml-3">{this.state.type}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AttrGeneral
                            setTo={this.state.general}
                            attributes={( data ) => {
                                this.setState( { general: data } );
                            }} />
                        <ValueAttributes
                            type={this.props.valueData.type}
                            setTo={this.state.attributes}
                            attributes={( data ) => {
                                this.setState( { attributes: data } );
                            }} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!this.isValid()}>
                            Zapisz
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

export default EditValue