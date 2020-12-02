import React, { Component } from "react";
import classnames from "classnames";
import "./list-items.scss";

import * as Icon from "react-bootstrap-icons";
import { Badge, Dropdown } from "react-bootstrap";

import { messagesNoElements } from "./Messages";

function ListHeader(props) {
	return (
		<div className="list-header">
			{props.columns.map((column, index) => (
				<span key={index}>{column}</span>
			))}
		</div>
	);
}

const ItemContent = (props) => (
	<div className="item">
		<span className="item-name">{props.item.name}</span>
		{props.badge !== null && (
			<Badge key="badge" className="item-badge ml-2" variant="info">
				{props.badge}
			</Badge>
		)}
		{props.item.description && (
			<div key="desc" className="item-description">
				{props.item.description}
			</div>
		)}
	</div>
);

const ItemActions = (props) => (
	<Dropdown key="item-actions" drop="left" className={classnames("fade", { show: props.show })}>
		<Dropdown.Toggle className="noCaret m-1 p-1 shadow-none" variant="flat">
			<Icon.ThreeDotsVertical size="20" />
		</Dropdown.Toggle>

		<Dropdown.Menu>
			<Dropdown.Header>Akcje</Dropdown.Header>
			{props.actions.map((action, index) => {
				const { content, onClick } = action;
				if (content)
					return (
						<Dropdown.Item
							key={index}
							onClick={() => {
								onClick(props.id);
							}}
						>
							{content}
						</Dropdown.Item>
					);
				else return <Dropdown.Divider key={index} />;
			})}
		</Dropdown.Menu>
	</Dropdown>
);

class ListItem extends Component {
	render() {
		const { _id: id, name, description } = this.props.item;

		const handleOnClick = (e) => {
			// e.stopPropagation();
			if (this.props.onChoice) this.props.onChoice(id);
		};

		const handleOnDoubleClick = (e) => {
			// e.stopPropagation();
			if (this.props.actions) {
				const action = this.props.actions.find((action) => action.default);
				if (action) action.onClick(id);
			}
		};

		const handleOnCheck = (e) => {
			// e.stopPropagation();
			if (this.props.onSelect) this.props.onSelect({ id, state: e.target.checked });
		};

		return (
			<div
				className={classnames(
					"d-flex flex-row jusitfy-content-start align-items-center",
					this.props.itemClass,
					{
						selected: this.props.choiced,
					}
				)}
				onClick={handleOnClick}
			>
				{this.props.selectable && (
					<div className="custom-control custom-checkbox">
						<input
							type="checkbox"
							className="custom-control-input"
							id={`checkbox-${id}`}
							checked={this.props.selected}
							onChange={handleOnCheck}
						/>
						<label className="custom-control-label" htmlFor={`checkbox-${id}`} />
					</div>
				)}

				<div
					className="d-flex flex-row justify-content-between align-items-start w-100"
					onDoubleClick={handleOnDoubleClick}
				>
					<ItemContent
						key="item-noselectable"
						badge={this.props.badge}
						item={{ name, description }}
					/>

					{this.props.actions && (
						<ItemActions
							key={`item-actions-${id}`}
							show={this.props.choiced}
							id={id}
							actions={this.props.actions}
						/>
					)}
				</div>
			</div>
		);
	}
}

/* Main component */

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
				<ListHeader columns={this.props.header} />
				{this.props.items.length > 0
					? this.props.items.map((item) => {
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
									onSelect={this.updateSelectedItems.bind(this)}
									choiced={item._id === this.props.choiced}
									onChoice={this.props.onChoice.bind(this)}
									actions={item._id !== null ? this.props.actions : null}
								/>
							);
					  })
					: this.props.onEmpty
					? this.props.onEmpty
					: messagesNoElements}
			</React.Fragment>
		);
	}
}

export default ListWithActions;
export { ListItem, ListHeader };
