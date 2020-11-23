import React, { Component } from "react";
import { observer } from "mobx-react";
import "./list-items.scss";

import * as Icon from "react-bootstrap-icons";
import { Badge, Dropdown } from "react-bootstrap";

/**
 * @typedef ListItemActions Właściwości akcji dla komponentu ListItem
 * @property {string|object} content - treść dla elementu akcji
 * @property {string} [default] - określa domyślną akcję dla podwójnego kliknięcia w komponent ListItem
 * @property {function} onClick - funkcja zdarzenia dla kliknięcia w akcję.
 */

/**
 * @typedef ListItemProps Właściwości komponentu ListItem
 * @property {Object} item - objekt z informacjami dla komponentu
 * @property {string} item._id - unikalny identyfikator
 * @property {string} item.name - nazwa
 * @property {string} item.description - opis
 * @property {boolean} choiced - określa, czy komponent jest w stanie wybranym
 * @property {function} onChoiceItem - funkcja zdarzenia dla wybrania elementu
 * @property {boolean} selectable - określa, czy komponent ma dodać element wyboru (checkbox)
 * @property {function} onSelect - funkcja zdarzenia dla zaznaczenia elementu (checkbox)
 * @property {Array} actions - definiuje akcje dostępne dla komponentu. Dodaje do komponentu element dropdown z listą akcji zdefiniowaną w tej tablicy.
 */

class ListItem extends Component {
	render() {
		const { _id: id, name, description } = this.props.item;

		const handleChange = (e) => {
			this.props.onSelect({ id, state: e.target.checked });
		};

		const ItemContent = (props) => (
			<div>
				<span className="item-name">{this.props.item.name}</span>
				{this.props.badge !== null && (
					<Badge key="badge" className="item-badge ml-2" variant="info">
						{this.props.badge}
					</Badge>
				)}
				{this.props.item.description && (
					<div key="desc" className="item-description">
						{this.props.item.description}
					</div>
				)}
			</div>
		);

		return (
			<div
				className={this.props.itemClass + (this.props.choiced === true ? " selected" : "")}
				style={{ cursor: this.props.onChoice ? "pointer" : "default" }}
				onClick={(e) => {
					if (this.props.onChoice) this.props.onChoice(id);
				}}
				onDoubleClick={(e) => {
					if (this.props.actions) {
						const action = this.props.actions.find((action) => action.default);
						if (action) action.onClick(id);
					}
				}}
			>
				{this.props.selectable ? (
					<div key={"item-selectable"} className="form-check">
						<input
							key="item-checkbox"
							className="form-check-input"
							type="checkbox"
							name="selectedItems"
							onChange={handleChange}
						/>
						<ItemContent key="item-data" badge={this.props.badge} item={{ name, description }} />
					</div>
				) : (
					<ItemContent
						key="item-noselectable"
						badge={this.props.badge}
						item={{ name, description }}
					/>
				)}

				{this.props.actions && (
					<Dropdown
						key="item-actions"
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
								const { content, onClick } = action;
								if (content)
									return (
										<Dropdown.Item
											key={index}
											onClick={() => {
												onClick(id);
											}}
										>
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

export default observer(ListItem);
