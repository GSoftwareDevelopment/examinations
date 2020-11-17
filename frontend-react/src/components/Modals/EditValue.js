import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Modal, Button, Form } from 'react-bootstrap';

import { ValuesTypesDef } from './Value/ValuesTypesDef';

import ValuesStore from '../../stores/values';
import ValidationStore from '../../stores/validation';

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
		ValidationStore.removeField( 'add-value-attr' );
	}

	isValid () {
		return ValidationStore.check( 'add-value-attr' );
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

			const fn = ValuesTypesDef.find( def => def.type === this.state.type );
			if ( fn && fn.precedSubmit ) fn.precedSubmit( newValue, attr );

			ValuesStore.update( this.state.id, newValue );
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
							attributes={( data ) => { this.setState( { general: data } ); }} />
						<ValueAttributes
							type={this.props.valueData.type}
							setTo={this.state.attributes}
							attributes={( data ) => { this.setState( { attributes: data } ); }} />
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

export default observer( EditValue )