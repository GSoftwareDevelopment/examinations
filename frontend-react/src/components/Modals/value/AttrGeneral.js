import React, { Component } from 'react'
import { Row, Col, Form } from 'react-bootstrap';

import ValidationStore from '../../../stores/validation';

class AttrGeneral extends Component {
	constructor( props ) {
		super( props );
		if ( props.setTo ) {
			this.state = {
				name: props.setTo.name,
				description: props.setTo.description,
				required: props.setTo.required,
			};
		} else {
			this.state = {
				name: '',
				description: '',
				required: true,
			};
		}
		ValidationStore.setField( 'modal-value', 'attr-name', false );
	}

	setInputValue ( property, val ) {
		this.setState( ( state ) => {
			let newState = { [ property ]: val };
			this.props.attributes( { ...state, ...newState } );
			return { ...state, ...newState };
		} );
	}

	componentDidMount () {
		this.props.attributes( this.state );
	}

	validate () {
		const valueName = this.state.name;
		if ( valueName.trim() === '' )
			ValidationStore.setField( 'modal-value', 'attr-name', 'Wprowadź nazwę dla definicji wartości' )
		else
			ValidationStore.setField( 'modal-value', 'attr-name', true )
	}

	render () {
		return (
			<React.Fragment>
				<Form.Row>
					<Form.Group as={Col} controlId="valueRequired">
						<Form.Check
							type="checkbox"
							checked={this.state.required}
							label="Wymagaj podania wartości"
							custom
							onChange={( e ) => {
								this.setInputValue( 'required', e.target.checked );
								this.forceUpdate( () => { this.validate(); } );
							}}
						></Form.Check>
					</Form.Group>
				</Form.Row>
				<Form.Group as={Row} controlId="valueName">
					<Form.Label column xs="3" sm="2">Nazwa</Form.Label>
					<Col>
						<Form.Control
							type="text"
							value={this.state.name}
							onChange={( e ) => { this.setInputValue( 'name', e.target.value ) }}
							onBlur={( e ) => { this.validate() }}
						/>
						{ValidationStore.formMessage( 'modal-value', 'attr-name' )}
					</Col>
				</Form.Group>
				<Form.Group as={Row} controlId="valueDescription">
					<Form.Label column xs="3" sm="2">Treść</Form.Label>
					<Col>
						<Form.Control
							as="textarea"
							value={this.state.description}
							onChange={( e ) => { this.setInputValue( 'description', e.target.value ) }}
							onBlur={( e ) => { this.validate() }}
						></Form.Control>
					</Col>
				</Form.Group>
			</React.Fragment>
		)
	}
}

export default AttrGeneral