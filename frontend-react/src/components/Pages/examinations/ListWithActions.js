import React, { Component } from "react";

import ListItem from "./ListItem";
import { Alert } from "react-bootstrap";

class ListWithActions extends Component {
	updateSelectedItems(itemState) {
		let items = this.props.selectedItems;
		if (!items) items = [];
		let newItems = [];
		if (itemState.state) newItems = [...items, itemState.id];
		else newItems = items.filter((id) => id !== itemState.id);
		this.props.onSelect(newItems);
	}

	render() {
		return (
			<React.Fragment>
				<div className="d-flex flex-row justify-content-between align-items-center bg-dark text-white p-2">
					{this.props.header}
				</div>
				{this.props.items.length > 0 ? (
					this.props.items.map((item) => {
						const selected = this.props.selectedItems;
						let isSelected = false;
						if (selected) isSelected = item._id === selected.find((id) => item._id === id);
						return (
							<ListItem
								key={"item-" + item._id}
								item={item}
								itemClass={this.props.itemClass}
								selectable={this.props.selectable}
								selected={isSelected}
								onSelect={(itemState) => {
									this.updateSelectedItems(itemState);
								}}
								choiced={item._id === this.props.choiced}
								onChoice={(id) => {
									this.props.onChoice(id);
								}}
								actions={item._id !== null ? this.props.actions : null}
							/>
						);
					})
				) : this.props.onEmpty ? (
					this.props.onEmpty
				) : (
					<Alert variant="info">Brak elementów</Alert>
				)}
			</React.Fragment>
		);
	}
}

export default ListWithActions;
