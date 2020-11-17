import React, { Component } from 'react'
import { observer } from 'mobx-react';

import { Form, Button } from 'react-bootstrap';

import ExaminationsStore from '../../../stores/examinations';
import GroupsStore from '../../../stores/groups';
import ValidationStore from '../../../stores/validation';

import AddGroup from '../AddGroup';

class TabGeneral extends Component {
	state = {
		name: '',
		group: null,
		modalAddGroup: false,
		validation: false,
	}

	constructor( props ) {
		super( props );

		this.innerRef = React.createRef();
	}

	componentDidMount () {
		setTimeout( () => {
			this.innerRef.current.focus();
		}, 1 )
	}

	validate ( currentState ) {
		const { name, group } = currentState || this.state;

		if ( name.trim() === '' ) {
			this.setState( { validation: 'Wprowadź Nazwę badania' } )
			ValidationStore.setField( 'add-examination', 'name', 'Wprowadź Nazwę badania' )
		} else if ( ExaminationsStore.getItems().filter(
			( item => ( item.group === group && item.name === name.trim() ) )
		).length > 0 ) {
			this.setState( { validation: 'W przypisanej grupie, podana nazwa badania juz występuje.' } );
			ValidationStore.setField( 'add-examination', 'name', 'W przypisanej grupie, podana nazwa badania juz występuje.' )
		} else {
			this.setState( { validation: true } );
			ValidationStore.setField( 'add-examination', 'name', true );
		}
	}

	render () {
		return ( <React.Fragment>
			<Form.Group controlId="name" className="mt-3">
				<Form.Label>Nazwa badania</Form.Label>
				<Form.Control
					ref={this.innerRef}
					type="text"
					name={"name"}
					required
					value={this.state.name}
					autoFocus
					onChange={( e ) => {
						const value = e.target.value;
						this.setState( { name: value } );
						this.props.onChange( e );
					}}
					onBlur={( e ) => { this.validate(); }}
				/>
				{this.state.validation !== false && this.state.validation !== true &&
					<Form.Text className="text-danger">{this.state.validation}</Form.Text>}
			</Form.Group>
			<Form.Group>
				<div className="d-flex flex-row justify-content-between align-items-center">
					<Form.Label htmlFor="group">Przypisz do grupy</Form.Label>
					<Button
						variant="light"
						size="sm"
						onClick={() => {
							this.setState( { modalAddGroup: true } );
						}}
					>Utwórz grupę</Button>
				</div>
				<Form.Control
					as="select"
					custom
					defaultValue=""
					name={"group"}
					onChange={( e ) => {
						this.setState( { group: e.target.value || null } );
						this.forceUpdate( () => {
							this.validate();
						} );
						this.props.onChange( e );
					}}
				>
					{GroupsStore.items.length > 0
						? <option key="noGroup" value="">Nie przypisuj do żadnej grupy</option>
						: <option key="empty" value="" disabled={true}>Brak zdefiniowanych grup</option>
					}
					{GroupsStore.items.map( group =>
						<option key={group._id} value={group._id}>{group.name}</option>
					)}
				</Form.Control>
			</Form.Group>
			<Form.Group className="form-group">
				<Form.Label htmlFor="description">Opis</Form.Label>
				<Form.Control
					as="textarea"
					rows="3"
					name={"description"}
					onChange={( e ) => { this.props.onChange( e ); }}
				></Form.Control>
			</Form.Group>
			{
				this.state.modalAddGroup &&
				<AddGroup
					show={this.state.modalAddGroup}
					onHide={() => { this.setState( { modalAddGroup: false } ); }}
				/>
			}
		</React.Fragment> )
	}
}

export default observer( TabGeneral )