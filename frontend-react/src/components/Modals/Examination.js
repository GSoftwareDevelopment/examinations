import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './examination.scss';

import ExaminationsStore from '../../stores/examinations';
import ValuesStore from '../../stores/values';
import ValidationStore from '../../stores/validation';

import { Form, Button, Modal, Tabs, Tab, Spinner } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { ModalTabsButtons } from '../ModalTabsButtons';

import TabGeneral from './examination-tabs/General';
import TabValues from './examination-tabs/Values';

class ModalExamination extends Component {
	constructor( props ) {
		super( props );

		if ( !props.setTo ) { // if `setTo` is set to` null` it indicates creating a new examination
			this.state = {
				activeTab: 'general',
				name: 'Nowe badanie',
				group: null,
				description: '',
			}
			ValuesStore.reset( [ { id: 0, type: 'numeric', name: 'Wartość', required: true } ] );
		} else { // ...otherwise, it is edit mode of existing examination.
			// Inside `isSet` property is object with examination data
			this.state = {
				activeTab: 'general',
				...props.setTo
			}
		}

		ValidationStore.removeField( 'modal-examination' );
		ValidationStore.setField( 'modal-examination', 'values', true );
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

		let result;
		const examinationData = {
			name: this.state.name,
			group: this.state.group || null,
			description: this.state.description,
			//it's needed to extract `id` property from object
			values: ValuesStore.getItems().map( ( { id, ...rest } ) => rest )
		}

		if ( !this.props.setTo )
			result = await ExaminationsStore.fetchAdd( examinationData )
		else
			result = await ExaminationsStore.fetchUpdate( this.state._id, examinationData )

		if ( result.OK ) {
			this.props.onHide();
			return
		}
	}

	isValid () {
		return ValidationStore.check( 'modal-examination' );
	}

	render () {

		const tabs = [
			{
				key: 'general',
				name: 'Ogólne',
				afterName: <React.Fragment>
					{ValidationStore.check( 'modal-examination', 'name' ) === false &&
						<Icon.ExclamationDiamond size="16" className="ml-1 text-danger" />}
				</React.Fragment>
			},
			{
				key: 'values',
				name: 'Wartości',
				afterName: <React.Fragment>
					{ValidationStore.check( 'modal-examination', 'values' ) === false &&
						<Icon.ExclamationDiamond size="16" className="ml-1 text-danger" />}
				</React.Fragment>
			},
			{
				key: 'norms',
				name: 'Normy',
			}
		]

		return (
			<Modal show={this.props.show} onHide={this.props.onHide} backdrop="static" autoFocus={false}>
				<Form
					autoComplete="off"
					onSubmit={( e ) => { this.doSubmit( e ) }}
				>
					<Modal.Header closeButton className="pb-0 border-0">
						{!this.props.setTo
							? <Modal.Title>Nowe badanie</Modal.Title>
							: <Modal.Title>Edycja badania</Modal.Title>
						}
					</Modal.Header>

					<ModalTabsButtons
						activeTab={this.state.activeTab}
						tabs={tabs}
						onTabSelect={( key ) => { this.setState( { activeTab: key } ); }} />

					<Modal.Body>
						<Tabs
							className="border-0"
							activeKey={this.state.activeTab}>
							<Tab eventKey="general">
								<TabGeneral
									setTo={this.props.setTo}
									onChange={( e ) => { this.setInputValue( e.target.name, e.target.value ) }}
								/>
							</Tab>
							<Tab eventKey="values">
								<TabValues />
							</Tab>
							<Tab eventKey="norms">
							</Tab>
						</Tabs>
					</Modal.Body>
					<Modal.Footer>
						<Button
							disabled={!this.isValid() || !ExaminationsStore.getState() === 'pending'}
							type="submit">
							{ExaminationsStore.getState() === 'pending'
								? <div className="d-flex felx-row align-items-center">
									<Spinner size="sm" animation="border" role="status" /><span className="ml-2">Zapisywanie...</span>
								</div>
								: "Dodaj"}
						</Button>
					</Modal.Footer>
				</Form>
			</Modal >
		)
	}
}

export default observer( ModalExamination )