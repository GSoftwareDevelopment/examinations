/*eslint no-duplicate-case: "off"*/

import React, { Component } from 'react'
import ConfigurationStore from '../../stores/configuration';
import ValuesStore from '../../stores/values';

import * as Icon from 'react-bootstrap-icons'
import { Button, Modal, Form, ListGroup } from 'react-bootstrap';

import { defineTypes } from './Value/DefineTypes';
import AttrGeneral from './Value/AttrGeneral';
import ValueAttributes from './Value/ValueAttributes';

class AddValue extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			type: 'DEFAULT',
			typeName: '',
			general: null,
			attributes: null,
			descriptionsHide: ConfigurationStore.getConf( 'AddValue', 'descriptionsHide' ),
		}
	}

	setInputValue ( property, val ) {
		this.setState( { [ property ]: val } );
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
			let newValue = {
				type: this.state.type,
				name: this.state.general.name,
				description: this.state.general.description,
				required: this.state.general.required,
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
			<Modal show={this.props.show} onHide={this.props.onHide} backdrop="static">
				<Form autoComplete="off" onSubmit={( e ) => { this.onSubmit( e ); }}>
					<Modal.Header closeButton>
						<Modal.Title className="d-flex flex-row align-items-center">
							{this.state.type === 'DEFAULT'
								? "Nowa definicja wartości"
								: <React.Fragment>
									<Button
										variant="flat"
										className="p-0 m-0 shadow-none"
										onClick={() => { this.setState( { type: "DEFAULT" } ) }}
									><Icon.CaretLeft size="24" className="mr-2" />
									</Button>
									Definiowana wartość: {this.state.typeName}
								</React.Fragment>}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.state.type === "DEFAULT"
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
									{defineTypes.map( type =>
										<ListGroup.Item
											key={"value-type-" + type.type}
											action
											onClick={( e ) => {
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
									attributes={( data ) => {
										this.setState( { general: data } );
									}}
								/>
								<ValueAttributes
									type={this.state.type}
									attributes={( data ) => {
										this.setState( { attributes: data } );
									}}
								/>
							</React.Fragment>
						}

					</Modal.Body>
					<Modal.Footer>
						{this.state.type !== 'DEFAULT' &&
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

export default AddValue