import React, { Component } from "react";
import { observer } from "mobx-react";

import * as Icon from "react-bootstrap-icons";
import { Alert } from "react-bootstrap";
import ListItem from "./ListItem";

function ListHeader() {
	return (
		<div className="d-flex flex-row justify-content-between align-items-center bg-dark text-white p-0">
			<button type="button" className="btn btn-flat shadow-none px-1 py-1 ml-0 text-white">
				Grupa/Nazwa badania
			</button>
		</div>
	);
}

class CombinedList extends Component {
	render() {
		const examinations = this.props.items;
		const groups = this.props.groups;
		let list;

		if (examinations.length === 0 && groups.length === 1) {
			list = (
				<Alert variant="info" className="m-3 text-center">
					<Icon.EmojiFrown size="64" />
					<br />
					Brak zdefiniowanych badań i grup.
				</Alert>
			);
		} else {
			list = groups.map((currentGroup) => {
				let groupItems;

				groupItems = examinations
					.filter((item) => item.group === currentGroup._id)
					.map((item) => {
						return (
							<ListItem
								key={item._id}
								itemClass="row-item"
								item={item}
								choiced={this.props.choiced === item._id}
								onChoice={(itemId) => {
									this.props.onChoiceGroup(item.group);
									this.props.onChoiceItem(itemId);
								}}
								selectable={true}
								onSelect={this.props.onSelect}
								actions={this.props.itemsActions}
							/>
						);
					});

				return (
					<React.Fragment>
						<ListItem
							key={currentGroup._id}
							itemClass="row-group"
							item={currentGroup}
							choiced={this.props.choiced === currentGroup._id}
							onChoice={(groupId) => {
								this.props.onChoiceGroup(groupId);
								this.props.onChoiceItem(groupId);
							}}
							selectable={false}
							actions={currentGroup._id !== null ? this.props.groupsActions : null}
						/>
						{groupItems.length === 0 ? (
							<div className="alert alert-info my-2">
								<p className="mb-0">Ta grupa nie posiada żadnych badań</p>
							</div>
						) : (
							groupItems
						)}
					</React.Fragment>
				);
			});
		}

		return (
			<React.Fragment>
				<ListHeader />
				{list}
			</React.Fragment>
		);
	}
}

export default observer(CombinedList);
