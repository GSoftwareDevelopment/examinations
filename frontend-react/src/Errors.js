import React, { Component } from 'react'
import { observer } from 'mobx-react';

import ValuesStore from './stores/values';
import ExaminationsStore from './stores/examinations';
import GroupsStore from './stores/groups';

import { Button, Modal } from 'react-bootstrap';

const ErrorHandle = observer( ( props ) => {
	const error=props.Store.getError();

	if ( props.Store.state === 'error' )
		return ( <Modal show={true}>
			<Modal.Header closeButton>
				<Modal.Title>{error.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			{error.msg}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary"
					onClick={() => { props.Store.clearError() }}
				>Close</Button>
			</Modal.Footer>
		</Modal> )
	else
		return null
} );

export default class Errors extends Component {
	render() {
		return (
				[ ExaminationsStore, GroupsStore, ValuesStore ]
					.map( ( Store, id ) => <ErrorHandle key={id} Store={Store} /> )
		)
	}
}
