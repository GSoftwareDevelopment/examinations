import React, { Component } from 'react'

import { Form, Button } from 'react-bootstrap';
import './AddExamination.scss';

import CheckValid from '../CheckValid';

import GroupsStore from '../../stores/groups';
import AddGroup from './AddGroup';

export default class TabGeneral extends Component {
	state = {
		name: '',
		group: null,
		modalAddGroup: false,
	}

	render () {
		return ( <React.Fragment>
			<Form.Group controlId="name" className="mt-3">
				<Form.Label>Nazwa badania</Form.Label>
				<Form.Control
					type="text"
					name={"name"}
					required
					autoFocus
					onBlur={( e ) => {
						this.setState( { name: e.target.value } );
						this.props.onChange( e );
					}}
				/>
				<CheckValid field="name" validate={this.props.validate} />
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