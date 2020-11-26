import React, { Component } from "react";
import { observer } from "mobx-react";

import * as Icon from "react-bootstrap-icons";
import ListItem from "../../Layout/ListItem";
import InfoBox from "../../Layout/InfoBox";
import { messageNoExaminationsAndGroups, messageGroupHasntExaminations } from "../../Messages";

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
	updateSelectedItems(itemState) {
		let items = this.props.selectedItems;
		if (!items) items = [];
		let newItems = [];
		if (itemState.state) newItems = [...items, itemState.id];
		else newItems = items.filter((id) => id !== itemState.id);
		this.props.onSelect(newItems);
	}

	render() {
		const examinations = this.props.items;
		const groups = this.props.groups;
		let list;

		if (examinations.length === 0 && groups.length === 1) {
			list = (
				<InfoBox icon={<Icon.EmojiFrown size="64" />} content={messageNoExaminationsAndGroups} />
			);
		} else {
			list = groups.map((currentGroup) => {
				let groupItems;

				groupItems = examinations
					.filter((item) => item.group === currentGroup._id)
					.map((item) => {
						const selected = this.props.selectedItems;
						let isSelected = false;
						if (selected) isSelected = item._id === selected.find((id) => item._id === id);
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
								selected={isSelected}
								onSelect={(itemState) => {
									this.updateSelectedItems(itemState);
								}}
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
							<InfoBox icon={null} content={messageGroupHasntExaminations} />
						) : (
							groupItems
						)}
					</React.Fragment>
				);
			});
		}

		return (
			<React.Fragment>
				<ListHeader key="header" />
				{list}
			</React.Fragment>
		);
	}
}

export default observer(CombinedList);
