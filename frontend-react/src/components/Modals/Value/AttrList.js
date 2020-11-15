/*eslint no-duplicate-case: "off"*/

import React, { Component } from 'react'
import * as Icon from 'react-bootstrap-icons'
import { Button, Form, Alert } from 'react-bootstrap';

class AttrList extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            items: props.setTo ? props.setTo.list : [ '' ],
            highligtItem: false,
        };
    }

    componentDidMount () {
        this.props.attributes( this.state );
    }

    setItemValue ( itemId, value ) {
        this.setState( oldState => {
            let items = [ ...oldState.items ];
            items[ itemId ] = value;
            this.props.attributes( { ...oldState, items } );
            return { items };
        } );
    }

    doInsertItem () {
        let doIt = true;
        this.state.items.forEach( ( item, id ) => {
            if ( item.trim() === '' ) {
                this.setState( { highlightItem: id } );
                doIt = false;
            }
        } );
        if ( doIt ) {
            this.setState( {
                items: [ ...this.state.items, '' ],
                highlightItem: false,
            } );
        }
    }

    doDeleteItem ( itemId ) {
        this.setState( {
            items: this.state.items.filter( ( item, id ) => ( id !== itemId ) ),
            highlightItem: false,
        } );
    }

    render () {
        return (
            <React.Fragment>
                <Form.Label>Lista wyboru</Form.Label>
                {this.state.items.length === 0
                    ? <Alert variant="warning" className="text-center">Brak zdefiniowanych opcji wyboru.</Alert>
                    : this.state.items.map( ( item, id ) => (
                        <Form.Group key={"enum-" + id} className="mb-0 d-flex flex-row justify-content-between align-items-start">
                            <div className="flex-fill">
                                <Form.Control
                                    type="text"
                                    value={item}
                                    name="option"
                                    placeholder={"#" + ( id + 1 )}
                                    onChange={( e ) => { this.setItemValue( id, e.target.value ); }}
                                    autoComplete="no" />
                                {this.state.highlightItem === id &&
                                    <Form.Text>Uzupełnij opcję wyboru.</Form.Text>}
                            </div>
                            <Button
                                onClick={( e ) => { this.doDeleteItem( id ) }}
                                variant="white" size="sm" className="my-0 px-2 shadow-none">
                                <Icon.DashCircle size="20" />
                            </Button>
                        </Form.Group>
                    ) )}
                <Button
                    block className="mt-2"
                    onClick={( e ) => { this.doInsertItem() }}
                    variant="light" size="sm">
                    <Icon.PlusCircle size="20" className="mr-2" />Dodaj opcje
                </Button>
            </React.Fragment>
        )
    }
}

export default AttrList