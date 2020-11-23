import React, { Component } from "react";
import { observer } from "mobx-react";

import ListItem from "./ListItem";
import { Alert } from "react-bootstrap";

class ListWithActions extends Component {
	render() {
		return (
			<React.Fragment>
				<div className="d-flex flex-row justify-content-between align-items-center bg-dark text-white p-2">
					{this.props.header}
				</div>
				{this.props.items.length > 0 ? (
					this.props.items.map((item) => (
						<ListItem
							key={"item-" + item._id}
							item={item}
							itemClass={this.props.itemClass}
							selectable={this.props.selectable}
							onSelect={this.props.onSelect}
							choiced={item._id === this.props.choiced}
							onChoice={(id) => {
								this.props.onChoice(id);
							}}
							actions={item._id !== null ? this.props.actions : null}
						/>
					))
				) : this.props.onEmpty ? (
					this.props.onEmpty
				) : (
					<Alert variant="info">Brak elementów</Alert>
				)}
			</React.Fragment>
		);
	}
}

export default observer(ListWithActions);
