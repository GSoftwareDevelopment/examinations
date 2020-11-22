import React, { Component } from "react";
import "./list-items.scss";

import * as Icon from "react-bootstrap-icons";
import { Badge, Dropdown } from "react-bootstrap";

class ListItem extends Component {
	render() {
		const { _id: id, name, description } = this.props.item;

		const handleChange = (e) => {
			this.props.onSelect({ id, state: e.target.checked });
		};

		const ItemContent = (props) => (
			<div key={"item-description-" + this.props.item.id}>
				<div className="d-flex flex-row align-items-center">
					{this.props.item.name}
					{this.props.badge !== null && (
						<Badge className="ml-2" key={"item-badge-" + id} variant="info">
							{this.props.badge}
						</Badge>
					)}
				</div>
				{this.props.item.description && (
					<div className="small text-dark">{this.props.item.description}</div>
				)}
			</div>
		);

		return (
			<div
				className={
					"row-item" +
					(this.props.choiced === true ? " bg-warning" : " bg-white")
				}
				style={{ cursor: this.props.onChoiceItem ? "pointer" : "default" }}
				onClick={(e) => {
					if (this.props.onChoiceItem) this.props.onChoiceItem(id);
				}}
				onDoubleClick={(e) => {
					if (this.props.actions) {
						const action = this.props.actions.find((action) => action.default);
						if (action) action.on[action.default]();
					}
				}}
			>
				{this.props.selectable ? (
					<div key={"item-description-" + id} className="form-check">
						<input
							className="form-check-input"
							type="checkbox"
							name="selectedItems"
							onChange={handleChange}
						/>
						<ItemContent
							badge={this.props.badge}
							item={{ name, description }}
						/>
					</div>
				) : (
					<ItemContent badge={this.props.badge} item={{ name, description }} />
				)}

				{this.props.actions && (
					<Dropdown
						drop="left"
						className={"fade " + (this.props.choiced ? "show" : "hide")}
					>
						<Dropdown.Toggle
							className="noCaret m-1 p-1 shadow-none"
							variant="flat"
							id="dropdown-basic"
						>
							<Icon.ThreeDotsVertical size="20" />
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Header>Akcje</Dropdown.Header>
							{this.props.actions.map((action, index) => {
								const { content, on } = action;
								if (content)
									return (
										<Dropdown.Item key={index} {...on}>
											{action.default ? <strong>{content}</strong> : content}
										</Dropdown.Item>
									);
								else return <Dropdown.Divider />;
							})}
						</Dropdown.Menu>
					</Dropdown>
				)}
			</div>
		);
	}
}

export default ListItem;
