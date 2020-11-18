import React, { Component } from 'react'
import { observer } from 'mobx-react';

import ValidationStore from '../../../stores/validation';

import { Row, Col, Form } from 'react-bootstrap';

class AttrNumeric extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			unit: props.setTo ? props.setTo.unit || '' : '',
		};
		ValidationStore.setField( 'modal-value', 'unit-field', true );
	}

	componentDidMount () {
		this.props.attributes( this.state );
	}

	setUnitValue ( value ) {
		this.setState( oldState => {
			let newState = { unit: value }
			this.props.attributes( { ...oldState, unit: value } );
			return newState;
		} );
	}

	validate () {
		ValidationStore.setField( 'modal-value', 'unit-field', true );
	}

	render () {
		return (
			<Form.Group as={Row} controlId="unit">
				<Form.Label column xs="8" sm="8">Jednostka</Form.Label>
				<Col xs="4" sm="4">
					<Form.Control
						type="text"
						value={this.state.unit}
						onChange={( e ) => { this.setUnitValue( e.target.value ) }}
						onBlur={( e ) => { this.validate(); }}
						autoComplete="no" />
				</Col>
			</Form.Group>
		)
	}
}

export default observer( AttrNumeric )