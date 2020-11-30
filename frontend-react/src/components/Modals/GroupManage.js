import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";

import GroupsStore from "../../stores/groups";
import ListWithActions from "../Layout/ListWithActions";
import * as Icon from "react-bootstrap-icons";
import { IconText } from "../Layout/IconText";

import ModalGroupAdd from "./GroupAdd";
import ModalGroupEdit from "./GroupEdit";

const groupHeader = (onClick) => [
	"Nazwa grupy",
	<Button className="m-0 px-2" variant="light" size="sm" onClick={onClick}>
		<IconText icon={<Icon.PlusSquare size="16" />} text="Utwórz grupę" />
	</Button>,
];

class ModalGroupManage extends Component {
	state = {
		modalGroupEdit: false,
		choicedItem: null,
	};

	itemActions = [
		{
			content: <IconText icon={<Icon.PencilSquare size="20" />} text="Edytuj grupę..." />,
			default: true,
			onClick: this.doEditGroup.bind(this),
		},
		{},
		{
			content: <IconText icon={<Icon.Trash size="20" />} text="Usuń grupę..." />,
			onClick: this.doDeleteGroup.bind(this),
		},
	];

	doCreateGroup(group) {
		// this.setState({ group: group._id });
		// this.props.onChange({ name: "group", value: group._id });
	}

	doEditGroup() {
		const groupId = this.state.choicedItem;
		console.log("Group edit #" + groupId);
		this.setState({
			modalGroupEdit: true,
		});
	}

	async doDeleteGroup() {
		const groupId = this.state.choicedItem;
		await GroupsStore.fetchDelete([groupId]);
		this.setState({
			selected: [],
			choicedItem: null,
		});
	}

	render() {
		const handleChoiceItem = (itemId) => {
			this.setState({ choicedItem: itemId });
		};
		const openModalGroupAdd = () => {
			this.setState({ modalGroupAdd: true });
		};
		const closeModalGroupAdd = () => {
			this.setState({ modalGroupAdd: false });
		};
		const closeModalGroupEdit = () => {
			this.setState({ modalGroupEdit: false });
		};

		const groups = GroupsStore.getItems();

		return (
			<Modal show={this.props.show} onHide={this.props.onHide} backdrop="static" autoFocus={false}>
				<Modal.Header closeButton>
					<Modal.Title>Zarządzanie grupami</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ListWithActions
						header={groupHeader(openModalGroupAdd)}
						itemClass="row-item"
						items={groups}
						selectable={false}
						choiced={this.state.choicedItem}
						onChoice={handleChoiceItem}
						actions={this.itemActions}
					/>
					{this.state.modalGroupEdit && (
						<ModalGroupEdit
							show={this.state.modalGroupEdit}
							groupId={this.state.choicedItem}
							onHide={closeModalGroupEdit}
						/>
					)}
					{this.state.modalGroupAdd && (
						<ModalGroupAdd
							show={this.state.modalGroupAdd}
							onHide={closeModalGroupAdd}
							isCreated={this.doCreateGroup}
						/>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={this.props.onHide}>
						Zamknij
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

export default ModalGroupManage;
