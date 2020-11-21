import React, { Component } from "react";
import { observer } from "mobx-react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";

import GroupsStore from "../../stores/groups";
import ValidationStore from "../../stores/validation";

class ModalGroupEdit extends Component {
	constructor(props) {
		super(props);
		const groupData = GroupsStore.getByID(props.groupId);
		console.log(groupData);
		this.state = {
			name: groupData.name,
			description: groupData.description,
		};

		ValidationStore.setField("edit-group", "name", false);
	}

	setInputValue(property, val) {
		this.setState({ [property]: val });
	}

	async onSubmit(e) {
		e.preventDefault();
		e.stopPropagation();

		const group = {
			name: this.state.name,
			description: this.state.description,
		};

		const result = await GroupsStore.fetchUpdate(this.props.groupId, group);

		if (result.OK) {
			console.log("Group is updated");
			if (this.props.onUpdate) this.props.onUpdate(result.updated);

			this.props.onHide();
		}
		return;
	}

	validate() {
		const groupName = this.state.name.trim();
		if (groupName.length === 0) {
			ValidationStore.setField("edit-group", "name", "Wprowadź nazwę grupy");
		} else {
			const exist = GroupsStore.getItems().find(
				(group) => group._id !== this.props.groupId && group.name === groupName
			);
			if (exist && exist.length !== 0)
				ValidationStore.setField(
					"edit-group",
					"name",
					"Podana nazwa grupy jest już w użyciu"
				);
			else ValidationStore.setField("edit-group", "name", true);
		}
	}

	render() {
		return (
			<Modal
				show={this.props.show}
				onHide={this.props.onHide}
				backdrop="static"
			>
				<Form
					onSubmit={(e) => {
						this.onSubmit(e);
					}}
				>
					<Modal.Header closeButton>
						<Modal.Title>Edycja grupy badań</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group>
							<Form.Label>Nazwa grupy</Form.Label>
							<Form.Control
								type="name"
								value={this.state.name}
								onChange={(e) => {
									this.setInputValue("name", e.target.value);
								}}
								onBlur={() => {
									this.validate();
								}}
							/>
							{ValidationStore.formMessage("edit-group", "name")}
						</Form.Group>
						<Form.Group>
							<Form.Label>Opis</Form.Label>
							<Form.Control
								as="textarea"
								row={3}
								value={this.state.description}
								onChange={(e) => {
									this.setInputValue("description", e.target.value);
								}}
								onBlur={() => {
									this.validate();
								}}
							/>
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button
							type="submit"
							variant="primary"
							disabled={
								!ValidationStore.check("edit-group") ||
								GroupsStore.getState() === "pending"
							}
						>
							{GroupsStore.getState() === "pending" ? (
								<div className="d-flex felx-row align-items-center">
									<Spinner size="sm" animation="border" role="status" />
									<span className="ml-2">Zapisywanie...</span>
								</div>
							) : (
								"Utwórz"
							)}
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		);
	}
}

export default observer(ModalGroupEdit);
