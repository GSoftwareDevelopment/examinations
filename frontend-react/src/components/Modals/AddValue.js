import React, { Component } from 'react';
import { observer } from 'mobx-react';

import * as Icon from 'react-bootstrap-icons';
import { Button, Modal, Form, ListGroup } from 'react-bootstrap';

import { ValuesTypesDef } from './value/ValuesTypesDef';

import ConfigurationStore from '../../stores/configuration';
import ValuesStore from '../../stores/values';
import ValidationStore from '../../stores/validation';

import AttrGeneral from './value/AttrGeneral';
import ValueAttributes from './value/ValueAttributes';

class AddValue extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			type: 'PROMPT',
			typeName: '',
			general: null,
			attributes: null,
			descriptionsHide: ConfigurationStore.getConf( 'AddValue', 'descriptionsHide' ),
		}
		ValidationStore.removeField( 'modal-value' );
	}

	setInputValue ( property, val ) {
		this.setState( { [ property ]: val } );
	}

	isValid () {
		if ( this.state.type === 'PROMPT' )
			return false

		return ValidationStore.check( 'modal-value' );
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

			ValuesStore.insert( newValue );
			this.props.onHide();
		}
	}

	toggleDescriptions () {
		this.setState( oldState => {
			const newState = !oldState.descriptionsHide;
			ConfigurationStore.setConf( 'AddValue', 'descriptionsHide', newState )
			return { descriptionsHide: newState }
		} );
	}

	render () {
		return (
			<Modal show={this.props.show} onHide={this.props.onHide} autoFocus={false} backdrop="static">
				<Form autoComplete="off" onSubmit={( e ) => { this.onSubmit( e ); }}>
					<Modal.Header closeButton>
						<Modal.Title className="d-flex flex-row align-items-center">
							{this.state.type === 'PROMPT'
								? "Nowa definicja wartości"
								: <React.Fragment>
									<Button
										variant="flat"
										className="p-0 m-0 shadow-none"
										onClick={() => { this.setState( { type: "PROMPT" } ) }}
									><Icon.CaretLeft size="24" className="mr-2" />
									</Button>
									Definiowana wartość: {this.state.typeName}
								</React.Fragment>}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.state.type === "PROMPT"
							? <React.Fragment>
								<div className="d-flex flex-row justify-content-between align-items-center mb-3">
									<div>Wybierz typ:</div>
									<Form.Check
										type="switch"
										id="description-switch"
										label="Ukryj opisy"
										checked={this.state.descriptionsHide}
										onChange={() => { this.toggleDescriptions(); }}
									/>
								</div>
								<ListGroup variant="flush">
									{ValuesTypesDef.map( type =>
										<ListGroup.Item
											key={"value-type-" + type.type}
											action
											onClick={( e ) => {
												ValidationStore.removeField( 'modal-value' );
												this.setInputValue( 'type', type.type );
												this.setState( { typeName: type.name } );
											}}>
											<strong>{type.name}</strong>
											{!this.state.descriptionsHide &&
												<div className="text-muted">{type.description}</div>
											}
										</ListGroup.Item>
									)}
								</ListGroup>
							</React.Fragment>

							: <React.Fragment>
								<AttrGeneral
									attributes={( data ) => { this.setState( { general: data } ); }}
								/>
								<ValueAttributes
									type={this.state.type}
									attributes={( data ) => { this.setState( { attributes: data } ); }}
								/>
							</React.Fragment>
						}

					</Modal.Body>
					<Modal.Footer>
						{this.state.type !== 'PROMPT' &&
							<Button
								type="submit"
								variant="primary"
								disabled={!this.isValid()}
							>
								Utwórz
							</Button>}
					</Modal.Footer>
				</Form>
			</Modal >
		)
	}
}

export default observer( AddValue )