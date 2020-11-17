import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './examination.scss';

import ExaminationsStore from '../../stores/examinations';
import ValuesStore from '../../stores/values';
import ValidationStore from '../../stores/validation';

import { Form, Button, Modal, Tabs, Tab, Spinner } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { ModalTabsButtons } from '../ModalTabsButtons';

import TabGeneral from './AddExamination-Tabs/General';
import TabValues from './AddExamination-Tabs/Values';

class ModalExamination extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			activeTab: 'general',
			name: 'Nowe badanie',
			group: null,
			description: '',
		}

		ValidationStore.removeField( 'add-examination' );
		ValuesStore.reset( [ { id: 0, type: 'numeric', name: 'Wartość', required: true } ] );
		ValidationStore.setField( 'add-examination', 'values', true );
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
			values: ValuesStore.getItems().map( ( { id, ...rest } ) => rest ),
		} );

		if ( result.OK ) {
			this.props.onHide();
			return
		}
	}

	isValid () {
		return ValidationStore.check( 'add-examination' );
	}

	render () {

		const tabs = [
			{
				key: 'general',
				name: 'Ogólne',
				afterName: <React.Fragment>
					{ValidationStore.check( 'add-examination', 'name' ) === false &&
						<Icon.ExclamationDiamond size="16" className="ml-1 text-danger" />}
				</React.Fragment>
			},
			{
				key: 'values',
				name: 'Wartości',
				afterName: <React.Fragment>
					{ValidationStore.check( 'add-examination', 'values' ) === false &&
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
						<Modal.Title>Nowe badanie</Modal.Title>
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