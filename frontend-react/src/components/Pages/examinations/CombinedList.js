import React, { Component } from "react";
import { observer } from "mobx-react";

import { ListHeader, ListItem } from "../../Layout/ListWithActions";
import { messageNoExaminationsAndGroups, messageGroupHasntExaminations } from "../../Messages";

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

		return (
			<div className="d-flex flex-column d-md-none">
				<ListHeader key="header" columns={["Grupa/Nazwa badania"]} />
				{examinations.length === 0 && groups.length === 0
					? messageNoExaminationsAndGroups
					: groups.map((currentGroup, index) => (
							<React.Fragment key={index}>
								<ListItem
									key={currentGroup._id}
									itemClass="row-group"
									item={currentGroup}
									choiced={this.props.choiced === currentGroup._id}
									onChoice={(groupId) => {
										this.props.onChoiceItem(groupId);
									}}
									selectable={false}
									actions={currentGroup._id !== null ? this.props.groupsActions : null}
								/>
								{examinations.filter((item) => item.group === currentGroup._id).length === 0
									? messageGroupHasntExaminations
									: examinations
											.filter((item) => item.group === currentGroup._id)
											.map((item) => {
												const selected = this.props.selectedItems;
												let isSelected = false;
												if (selected)
													isSelected = item._id === selected.find((id) => item._id === id);
												return (
													<ListItem
														key={item._id}
														itemClass="row-item"
														item={item}
														choiced={this.props.choiced === item._id}
														onChoice={(itemId) => {
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
											})}
							</React.Fragment>
					  ))}
			</div>
		);
	}
}

export default observer(CombinedList);
