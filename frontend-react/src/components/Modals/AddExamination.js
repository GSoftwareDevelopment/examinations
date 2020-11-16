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
			name: 'Nowe badanie',
			group: null,
			description: '',
			values: [
				{
					id: 0,
					type: 'numeric',
					name: 'Wartość',
					required: true,
				}
			],
		}
	}

	setInputValue ( property, val ) {
		this.setState( oldState => {
			if ( property === 'group' && val === '' ) val = null;
			let changes = { [ property ]: val }
			return { ...oldState, ...changes }
		} );
	}

	async doSubmit ( e ) {
		e.preventDefault();
		e.stopPropagation();

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
	}

	//
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

	canDoCreate () {
		return this.validateGeneral().length === 0 && this.validateValues().length === 0;
	}

	//
	validateGeneral () {
		let validationErrors = [];
		const { name, group } = this.state;

		if ( name.trim() === '' ) {
			validationErrors.push( { field: 'name', message: 'Podaj Nazwę badania' } );
		}
		if ( ExaminationsStore.getItems().filter(
			( item => ( item.group === group && item.name === name.trim() ) )
		).length > 0 ) {
			validationErrors.push( { field: 'name', message: 'W przypisanej grupie, podana nazwa badania juz występuje.' } );
		}
		return validationErrors;
	}

	validateValues () {
		let validationErrors = [];
		if ( this.state.values.length === 0 ) {
			validationErrors.push( { field: 'values', message: 'Lista definicji wartości nie może być pusta' } );
		}
		return validationErrors;
	};

	render () {
		return (
			<Modal {...this.props} backdrop="static" autoFocus={true}>
				<Form
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
										<Nav.Link eventKey="general">Ogólne</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="values">Wartości</Nav.Link>
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
								<TabGeneral
									onChange={( e ) => { this.setInputValue( e.target.name, e.target.value ) }}
									validate={this.validateGeneral()}
								/>
							</Tab>
							<Tab eventKey="values">
								<TabValues
									values={this.state.values}
									onAdd={( data ) => { this.doValueAdd( data ); }}
									onDelete={( id ) => { this.doValueDelete( id ); }}
									onUpdate={( id, data ) => { this.doValueUpdate( id, data ); }}
									validate={this.validateValues()}
								/>
							</Tab>
							<Tab eventKey="norms">
							</Tab>
						</Tabs>
					</Modal.Body>
					<Modal.Footer>
						<Button
							disabled={!this.canDoCreate() ||
								!ExaminationsStore.getState() === 'pending'}
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