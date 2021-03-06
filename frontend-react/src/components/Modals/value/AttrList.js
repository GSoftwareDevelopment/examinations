/*eslint no-duplicate-case: "off"*/

import React, { Component } from "react";

import ValidationStore from "../../../stores/validation";

import * as Icon from "react-bootstrap-icons";
import { Button, Form } from "react-bootstrap";
import InfoBox from "../../Layout/InfoBox";

class AttrList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: props.setTo ? props.setTo.list : [""],
			highligtItem: false,
		};
		if (!props.setTo) ValidationStore.setField("modal-value", "zero-field", false);
	}

	componentDidMount() {
		this.props.attributes(this.state);
	}

	setItemValue(itemId, value) {
		this.setState((oldState) => {
			let items = [...oldState.items];
			items[itemId] = value;
			this.props.attributes({ ...oldState, items });
			return { items };
		});
	}

	checkEmptyOptions(items) {
		if (!items) items = this.state.items;
		let isEmpty = false;
		items.forEach((item, id) => {
			if (item.trim() === "") {
				this.setState({ highlightItem: id });
				ValidationStore.setField("modal-value", "zero-field", "Pole wyboru nie może być puste.");
				ValidationStore.setField("modal-value", "empty-list", true);
				isEmpty = true;
			}
		});

		if (!isEmpty) {
			this.setState({ highlightItem: false });
			ValidationStore.setField("modal-value", "zero-field", true);
		}
		return isEmpty;
	}

	doInsertItem() {
		if (!this.checkEmptyOptions()) {
			this.setState({ items: [...this.state.items, ""] });
			ValidationStore.setField("modal-value", "zero-field", false);
			ValidationStore.setField("modal-value", "empty-list", true);
		}
	}

	doDeleteItem(itemId) {
		const items = this.state.items.filter((item, id) => id !== itemId);
		this.setState({
			items,
			highlightItem: false,
		});
		if (items.length === 0) {
			ValidationStore.setField("modal-value", "empty-list", "Brak zdefiniowanych opcji wyboru");
		} else {
			if (!this.checkEmptyOptions(items))
				ValidationStore.setField("modal-value", "empty-list", true);
		}
	}

	render() {
		return (
			<React.Fragment>
				<Form.Label>Lista wyboru</Form.Label>
				{this.state.items.length === 0
					? ValidationStore.formMessage("modal-value", "empty-list")
					: this.state.items.map((item, id) => (
							<Form.Group
								key={"enum-" + id}
								className="mb-0 d-flex flex-row justify-content-between align-items-start"
							>
								<div className="flex-fill">
									<Form.Control
										autoFocus
										type="text"
										value={item}
										name="option"
										placeholder={"#" + (id + 1)}
										onChange={(e) => {
											this.setItemValue(id, e.target.value);
										}}
										onBlur={(e) => {
											this.checkEmptyOptions();
										}}
										autoComplete="off"
									/>
									{this.state.highlightItem === id && (
										<InfoBox
											className="valid-error"
											icon={<Icon.ExclamationDiamond size="16" />}
											content={ValidationStore.formMessage("modal-value", "zero-field")}
										/>
									)}
								</div>
								<Button
									onClick={(e) => {
										this.doDeleteItem(id);
									}}
									variant="white"
									size="sm"
									className="my-0 px-2 shadow-none"
								>
									<Icon.DashCircle size="20" />
								</Button>
							</Form.Group>
					  ))}
				<Button
					block
					className="mt-2"
					onClick={(e) => {
						this.doInsertItem();
					}}
					variant="light"
					size="sm"
				>
					<Icon.PlusCircle size="20" className="mr-2" />
					Dodaj opcje
				</Button>
			</React.Fragment>
		);
	}
}

export default AttrList;
