import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './examination.scss';

import ExaminationsStore from '../../stores/examinations';
import ValuesStore from '../../stores/values';
import ValidationStore from '../../stores/validation';

import { Nav, Form, Button, Modal, Tabs, Tab, Spinner } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

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
		return (
			<Modal {...this.props} backdrop="static" autoFocus={false}>
				<Form
					autoComplete="off"
					onSubmit={( e ) => { this.doSubmit( e ) }}
				>
					<Modal.Header closeButton className="pb-0 border-0">
						<Modal.Title>Nowe badanie</Modal.Title>
					</Modal.Header>

					<Modal.Header className="py-0">
						<Tab.Container
							defaultActiveKey="general"
							onSelect={( key ) => { this.setState( { activeTab: key } ); }}>
							<Nav as="nav" variant="tabs" className="tabbable h6 flex-row mt-3"
								style={{ transform: "translateY(1px)" }}>
								<Nav.Item>
									<Nav.Link eventKey="general">Ogólne
												{ValidationStore.check( 'add-examination', 'name' ) === false &&
											<Icon.ExclamationDiamond size="16" className="ml-1 text-danger" />}
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="values">Wartości
												{ValidationStore.check( 'add-examination', 'values' ) === false &&
											<Icon.ExclamationDiamond size="16" className="ml-1 text-danger" />}
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="norms">Normy</Nav.Link>
								</Nav.Item>
							</Nav>
						</Tab.Container>
					</Modal.Header>
					<Modal.Body>
						<Tabs
							variant="pills"
							defaultActiveKey="general"
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