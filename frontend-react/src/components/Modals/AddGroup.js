import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';

import GroupsStore from '../../stores/groups';
import ValidationStore from '../../stores/validation';

class AddGroup extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			name: '',
			description: '',
			uniqueName: true
		}

		ValidationStore.setField( 'add-group', 'name', false );
	}

	setInputValue ( property, val ) {
		val = val.trim();
		this.setState( { [ property ]: val } );
	}

	async onSubmit ( e ) {
		e.preventDefault();
		e.stopPropagation();

		const newGroup = {
			name: this.state.name,
			description: this.state.description
		}

		const result = await GroupsStore.fetchAdd( newGroup );

		if ( result.OK ) {
			console.log( 'Group is added' );
			if ( this.props.isCreated )
				this.props.isCreated( result.created )

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

	validate () {
		const groupName = this.state.name.trim();
		if ( groupName.length === 0 ) {
			ValidationStore.setField( 'add-group', 'name', 'Wprowadź nazwę grupy' );
		} else {
			const exist = GroupsStore.getItems().find( group => group.name === groupName );
			if ( exist && exist.length !== 0 )
				ValidationStore.setField( 'add-group', 'name', 'Podana nazwa grupy jest już w użyciu' )
			else
				ValidationStore.setField( 'add-group', 'name', true );
		}
	}

	render () {
		return (
			<Modal show={this.props.show} onHide={this.props.onHide} backdrop="static">
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
								onBlur={() => { this.validate() }}
							/>
							{ValidationStore.formMessage( 'add-group', 'name' )}
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
							disabled={!ValidationStore.check( 'add-group' ) || GroupsStore.getState() === 'pending'}>
							{GroupsStore.getState() === 'pending'
								? <div className="d-flex felx-row align-items-center">
									<Spinner size="sm" animation="border" role="status" /><span className="ml-2">Zapisywanie...</span>
								</div>
								: "Utwórz"}
						</Button>
					</Modal.Footer>
				</Form>
			</Modal >
		)
	}
}

export default observer( AddGroup )