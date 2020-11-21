import React, { Component } from "react";
import { observer } from "mobx-react";

import { Form, Button } from "react-bootstrap";

import ExaminationsStore from "../../../stores/examinations";
import GroupsStore from "../../../stores/groups";
import ValidationStore from "../../../stores/validation";

import AddGroup from "../AddGroup";

class TabGeneral extends Component {
	constructor(props) {
		super(props);

		if (!props.setTo)
			this.state = {
				name: "",
				group: null,
				description: "",
				modalAddGroup: false,
			};
		else
			this.state = {
				id: props.setTo._id,
				name: props.setTo.name,
				group: props.setTo.group || null,
				description: props.setTo.description,
			};
		this.innerRef = React.createRef();
	}

	componentDidMount() {
		setTimeout(() => {
			this.innerRef.current.focus();
		}, 1);
	}

	validate() {
		let { id: _id, name, group } = this.state;
		name = name.trim();

		if (name === "") {
			ValidationStore.setField(
				"modal-examination",
				"name",
				"Wprowadź Nazwę badania"
			);
		} else if (
			ExaminationsStore.getItems().find(
				(item) => item._id !== _id && item.group === group && item.name === name
			)
		) {
			ValidationStore.setField(
				"modal-examination",
				"name",
				"W przypisanej grupie, podana nazwa badania juz występuje."
			);
		} else {
			ValidationStore.setField("modal-examination", "name", true);
		}
	}

	render() {
		return (
			<React.Fragment>
				<Form.Group controlId="name" className="mt-3">
					<Form.Label>Nazwa badania</Form.Label>
					<Form.Control
						ref={this.innerRef}
						type="text"
						name={"name"}
						required
						value={this.state.name}
						autoFocus
						onChange={(e) => {
							const { name, value } = e.target;
							this.setState({ name: value });
							this.props.onChange({ name, value });
						}}
						onBlur={(e) => {
							this.validate();
						}}
					/>
					{ValidationStore.formMessage("modal-examination", "name")}
				</Form.Group>
				<Form.Group>
					<div className="d-flex flex-row justify-content-between align-items-center">
						<Form.Label htmlFor="group">Przypisz do grupy</Form.Label>
						<Button
							variant="light"
							size="sm"
							onClick={() => {
								this.setState({ modalAddGroup: true });
							}}
						>
							Utwórz grupę
						</Button>
					</div>
					<Form.Control
						as="select"
						custom
						value={this.state.group || ""}
						name={"group"}
						onChange={(e) => {
							const { name, value } = e.target;
							this.setState({ group: value || null });
							this.forceUpdate(() => {
								this.validate();
							});
							this.props.onChange({ name, value });
						}}
					>
						{GroupsStore.items.length > 0 ? (
							<option key="noGroup" value="">
								Nie przypisuj do żadnej grupy
							</option>
						) : (
							<option key="empty" value="" disabled={true}>
								Brak zdefiniowanych grup
							</option>
						)}
						{GroupsStore.items.map((group) => (
							<option key={group._id} value={group._id}>
								{group.name}
							</option>
						))}
					</Form.Control>
				</Form.Group>
				<Form.Group className="form-group">
					<Form.Label htmlFor="description">Opis</Form.Label>
					<Form.Control
						as="textarea"
						rows="3"
						name={"description"}
						value={this.state.description || ""}
						onChange={(e) => {
							const { name, value } = e.target;
							this.setState({ description: value });
							this.props.onChange({ name, value });
						}}
					/>
				</Form.Group>
				{this.state.modalAddGroup && (
					<AddGroup
						show={this.state.modalAddGroup}
						onHide={() => {
							this.setState({ modalAddGroup: false });
						}}
						isCreated={(group) => {
							this.setState({ group: group._id });
							this.props.onChange({ name: "group", value: group._id });
						}}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default observer(TabGeneral);
