/*eslint no-duplicate-case: "off"*/

import React, { Component } from 'react'

import ValidationStore from '../../../stores/validation';

import * as Icon from 'react-bootstrap-icons'
import { Button, Form, Alert } from 'react-bootstrap';

class AttrList extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			items: props.setTo ? props.setTo.list : [ '' ],
			highligtItem: false,
		};
		if ( !props.setTo )
			ValidationStore.setField( 'add-value-attr', 'zero-field', false );
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

	checkEmptyOptions ( items ) {
		if ( !items ) items = this.state.items;
		let isEmpty = false;
		items.forEach( ( item, id ) => {
			if ( item.trim() === '' ) {
				this.setState( { highlightItem: id } );
				ValidationStore.setField( 'add-value-attr', 'zero-field', 'Pole wyboru nie może być puste.' )
				ValidationStore.setField( 'add-value-attr', 'empty-list', true );
				isEmpty = true;
			}
		} );

		if ( !isEmpty ) {
			this.setState( { highlightItem: false } );
			ValidationStore.setField( 'add-value-attr', 'zero-field', true )
		}
		return isEmpty
	}

	doInsertItem () {
		if ( !this.checkEmptyOptions() ) {
			this.setState( { items: [ ...this.state.items, '' ] } );
			ValidationStore.setField( 'add-value-attr', 'zero-field', false )
			ValidationStore.setField( 'add-value-attr', 'empty-list', true );
		}
	}

	doDeleteItem ( itemId ) {
		const items = this.state.items.filter( ( item, id ) => ( id !== itemId ) );
		this.setState( {
			items,
			highlightItem: false,
		} );
		if ( items.length === 0 ) {
			ValidationStore.setField( 'add-value-attr', 'empty-list', 'Brak zdefiniowanych opcji wyboru' );
		} else {
			if ( !this.checkEmptyOptions( items ) )
				ValidationStore.setField( 'add-value-attr', 'empty-list', true );
		}
	}

	render () {
		return (
			<React.Fragment>
				<Form.Label>Lista wyboru</Form.Label>
				{this.state.items.length === 0
					? <Alert variant="warning" className="text-center">
						{ValidationStore.getField( 'add-value-attr', 'empty-list' )[ 0 ].value}
					</Alert>
					: this.state.items.map( ( item, id ) => (
						<Form.Group key={"enum-" + id} className="mb-0 d-flex flex-row justify-content-between align-items-start">
							<div className="flex-fill">
								<Form.Control
									autoFocus
									type="text"
									value={item}
									name="option"
									placeholder={"#" + ( id + 1 )}
									onChange={( e ) => { this.setItemValue( id, e.target.value ); }}
									onBlur={( e ) => { this.checkEmptyOptions(); }}
									autoComplete="off" />
								{this.state.highlightItem === id &&
									<Form.Text>{ValidationStore.getField( 'add-value-attr', 'zero-field' )[ 0 ].value}</Form.Text>}
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