import React, { Component } from "react";
import { observer } from "mobx-react";

import ExaminationsStore from "../../../stores/examinations";
import GroupsStore from "../../../stores/groups";

import { Spinner } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import ListItem from "./ListItem";

function ListHeader() {
	return (
		<div className="d-flex flex-row justify-content-between align-items-center bg-dark text-white p-0">
			<button
				type="button"
				className="btn btn-flat shadow-none px-1 py-1 ml-0 text-white"
			>
				Nazwa grupy
			</button>
		</div>
	);
}

class GroupsList extends Component {
	render() {
		const groups = [null, ...GroupsStore.items];
		let list;

		list = groups.map((item) => {
			let totalItems;
			if (item) {
				totalItems = ExaminationsStore.getItemsByGroupId(item._id).length;
			} else {
				totalItems = ExaminationsStore.getItemsByGroupId(null).length;
				item = {
					_id: null,
					name: "Bez grupy",
					description: "Badania nieprzypisane do grup",
				};
			}

			return (
				<ListItem
					key={"group-item-" + item._id}
					badge={totalItems}
					choiced={item._id === this.props.group}
					item={item}
					selectable={false}
					actions={
						item._id === null
							? null
							: [
									{
										content: (
											<>
												<Icon.PencilSquare size="20" /> Edytuj grupę...
											</>
										),
										default: "onClick",
										on: {
											onClick: () => {
												this.props.onItemEdit(item._id);
											},
										},
									},
									{},
									{
										content: (
											<>
												<Icon.Trash size="20" /> Usuń grupę
											</>
										),
										on: {
											onClick: () => {
												this.props.onItemDelete(item._id);
											},
										},
									},
							  ]
					}
					onChoiceItem={this.props.onItemChoice}
				/>
			);
		});

		if (this.props.silentFetch) {
			return (
				<React.Fragment>
					<ListHeader key="group-list-header" />
					{list}
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<ListHeader key="group-list-header" />
					{GroupsStore.state === "pending" ? (
						<div
							key="group-loader"
							className="d-flex flex-row justify-content-center align-items-center p-3"
						>
							<Spinner animation="border" role="status" />
							<div className="ml-3"> Wczytywanie danych </div>
						</div>
					) : (
						list
					)}
				</React.Fragment>
			);
		}
	}
}

export default observer(GroupsList);
