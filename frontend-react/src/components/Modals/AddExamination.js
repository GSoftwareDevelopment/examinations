import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './AddExamination.scss';

import { Nav, Form, Button, Modal, Tabs, Tab, Spinner } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

import ExaminationsStore from '../../stores/examinations';
import TabGeneral from './AddExaminations-Tab-General';
import TabValues from './AddExaminations-Tab-Values';

class AddExamination extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            activeTab: 'general',
            name: '',
            group: '',
            description: '',
            values: [
                {
                    id: 0,
                    type: 'numeric',
                    name: 'Wartość',
                    required: true,
                }
            ],
            // validations state
            validated: false,
            uniqueName: true,
            valuesError: false,
        }
    }

    setInputValue ( property, val ) {
        this.setState( oldState => {
            let changes = { [ property ]: val }
            return { ...oldState, ...changes }
        } );
    }

    async doSubmit ( e ) {
        e.preventDefault();
        const form = e.currentTarget;
        if ( form.checkValidity() === false ) {
            e.stopPropagation();
            this.setState( { validated: true } );
            this.setState( { activeTab: 'general' } );
            return false;
        }

        const result = await ExaminationsStore.fetchAdd( {
            name: this.state.name,
            group: this.state.group || null,
            description: this.state.description,
            //it's needed to extract `id` property from object
            values: this.state.values.map( ( { id, ...rest } ) => rest ),
        } );

        if ( result.OK ) {
            this.props.onHide();
            return
        }

        if ( result.error && result.error.name === "ValidatorError" ) {
            switch ( result.error.kind ) {
                case "unique":
                    this.setState( { activeTab: 'general' } );
                    this.setState( { uniqueName: false } );
                    return
                case "values":
                    this.setState( { activeTab: 'values' } );
                    this.setState( { valuesError: true } );
                    return
                default:
                    console.error( result );
            }
            return false;
        }

    }

    doValueAdd ( data ) {
        console.log( 'Adding new value...', data )

        // Determine the highest value for the value index
        let lastValueId = 0;
        this.state.values.forEach( ( item ) => {
            if ( item.id > lastValueId )
                lastValueId = item.id
        } );
        lastValueId++ // incrase to next "free" value

        this.setState( ( oldState ) => {
            oldState.values.push( { id: lastValueId, ...data } );
            return oldState;
        } );
    }

    doValueDelete ( valueId ) {
        console.log( `Delete value entry #${valueId}` );
        this.setState( {
            values: this.state.values.filter( value => ( value.id !== valueId ) )
        } );
    }

    doValueUpdate ( valueId, data ) {
        console.log( `Edit value entry #${valueId}`, data );
        this.setState( ( oldState ) => {
            oldState.values.forEach( ( value, index ) => {
                if ( value.id === valueId ) {
                    oldState.values[ index ] = { ...value, ...data };
                }
            } );
            return oldState;
        } );
    }

    render () {
        const canDoAdd = () => this.state.name.trim() !== '' && this.state.values.length > 0;

        return (
            <Modal {...this.props} backdrop="static" autoFocus={true}>
                <Form
                    noValidate
                    validated={this.state.validated}
                    autoComplete="off"
                    onSubmit={( e ) => { this.doSubmit( e ) }}
                >
                    <Modal.Header closeButton className="pb-0">
                        <Modal.Title>
                            Nowe badanie
                            <Tab.Container
                                defaultActiveKey="general"
                                onSelect={( key ) => { this.setState( { activeTab: key } ); }}>
                                <Nav as="h6" variant="tabs" className="flex-row mt-3"
                                    style={{ transform: "translateY(1px)" }}>
                                    <Nav.Item>
                                        <Nav.Link eventKey="general">Ogólne
                                        {this.state.activeTab !== 'general' && ( this.state.name.trim() === '' || !this.state.uniqueName ) &&
                                                <Icon.ExclamationDiamond className="ml-2 text-danger" />}
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="values">Wartości
                                        {this.activeTab !== 'values' && this.state.values.length === 0 &&
                                                <Icon.ExclamationDiamond className="ml-2 text-danger" />}
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="norms">Normy</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Tab.Container>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs
                            variant="pills"
                            defaultActiveKey="general"
                            activeKey={this.state.activeTab}>
                            <Tab eventKey="general">
                                {!this.state.uniqueName &&
                                    <p className="text-danger small">
                                        <Icon.ExclamationDiamond className="mr-2" />
                                        Podana <strong>Nazwa badania</strong> jest już zdefiniowana
                                        {this.state.group !== '' && <span>
                                            w przypisanej grupie
                                        </span>}
                                    </p>}
                                <TabGeneral
                                    onChange={( e ) => { this.setInputValue( e.target.name, e.target.value ) }}
                                />
                            </Tab>
                            <Tab eventKey="values">
                                <TabValues
                                    values={this.state.values}
                                    onAdd={( data ) => { this.doValueAdd( data ); }}
                                    onDelete={( id ) => { this.doValueDelete( id ); }}
                                    onUpdate={( id, data ) => { this.doValueUpdate( id, data ); }}
                                />
                            </Tab>
                            <Tab eventKey="norms">
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            disabled={!canDoAdd() || ExaminationsStore.getState() === 'pending'}
                            type="submit">
                            {ExaminationsStore.getState() === 'pending'
                                ? <div className="d-flex felx-row align-items-center">
                                    <Spinner size="sm" animation="border" role="status" /><span className="ml-2">Zapisywanie...</span>
                                </div>
                                : "Dodaj"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        )
    }
}

export default observer( AddExamination )