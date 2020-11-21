import React, { Component } from "react";
import { observer } from "mobx-react";

import ExaminationsStore from "../../../stores/examinations";
import GroupsStore from "../../../stores/groups";

import { Alert, Spinner } from "react-bootstrap";
import ListItem from "./ListItem";

function ListHeader() {
	return (
		<div className="d-flex flex-row justify-content-between align-items-center bg-primary text-white p-0">
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
			if (item) {
				const totalItems = ExaminationsStore.getItemsByGroupId(item._id).length;
				return (
					<ListItem
						badge={totalItems}
						choiced={item._id === this.props.group}
						key={item._id}
						item={item}
						selectable={false}
						onClickDelete={this.props.onItemDelete}
						onClickEdit={this.props.onItemEdit}
						onChoiceItem={this.props.onItemChoice}
					/>
				);
			} else {
				const totalItems = ExaminationsStore.getItemsByGroupId(null).length;
				return (
					<React.Fragment>
						<ListItem
							choiced={this.props.group === null}
							key={"null"}
							badge={totalItems}
							item={{
								_id: null,
								name: "Bez grupy",
								description: "Badania nieprzypisane do grup",
							}}
							selectable={false}
							onChoiceItem={this.props.onItemChoice}
						/>
						{groups.length === 1 && (
							<Alert key="info" variant="info" className="m-3 text-center">
								Brak zdefiniowanych grup.
							</Alert>
						)}
					</React.Fragment>
				);
			}
		});

		if (this.props.silentFetch) {
			return (
				<React.Fragment>
					<ListHeader />
					{list}
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<ListHeader />
					{GroupsStore.state === "pending" ? (
						<div className="d-flex flex-row justify-content-center align-items-center p-3">
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
