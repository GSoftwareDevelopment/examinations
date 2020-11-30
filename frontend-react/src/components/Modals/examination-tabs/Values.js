import React, { Component } from "react";
import { observer } from "mobx-react";

import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import ListWithActions from "../../Layout/ListWithActions";
import InfoBox from "../../Layout/InfoBox";
import { IconText } from "../../Layout/IconText";
import { messageNoValuesDefinitions } from "../../Messages";

import ValuesStore from "../../../stores/values";
import ValidationStore from "../../../stores/validation";

import { valueSymbolize } from "../value/ValuesTypesDef";

import AddValue from "../AddValue";
import EditValue from "../EditValue";

class TabValues extends Component {
	state = {
		choicedValue: null,
		modalAddValue: false,
		modalEditValue: false,
	};

	valueActions = [
		{
			content: <IconText icon={<Icon.PencilSquare size="20" />} text="Edytuj definicje..." />,
			default: true,
			onClick: this.doEditValue.bind(this),
		},
		{},
		{
			content: <IconText icon={<Icon.Trash size="20" />} text="Usuń definicje..." />,
			onClick: this.doDeleteValue.bind(this),
		},
	];

	doEditValue() {
		this.setState({ modalEditValue: true });
	}

	doDeleteValue() {
		const itemId = this.state.choicedValue;
		ValuesStore.remove(itemId);
		this.validation();
	}

	validation() {
		const values = ValuesStore.getItems().filter((value) => value.action !== "delete");
		if (values.length > 0) {
			ValidationStore.setField("modal-examination", "values", true);
		} else {
			ValidationStore.setField(
				"modal-examination",
				"values",
				"Badanie musi zawierać przynajmniej jedną definicję wartości"
			);
		}
	}

	render() {
		const handleChoiceValue = (itemId) => {
			this.setState({ choicedValue: itemId });
		};

		const items = ValuesStore.getItems()
			.filter((item) => item.action !== "delete")
			.map((value) => ({
				_id: value.id,
				name: valueSymbolize(value),
				description: value.description,
			}));

		return (
			<React.Fragment>
				<ListWithActions
					header={[
						"Definicje",
						<Button
							className="m-0"
							onClick={() => {
								this.setState({ modalAddValue: true });
							}}
							variant="light"
							size="sm"
						>
							<Icon.PlusCircle size="16" className="mr-1" />
							Dodaj definicje...
						</Button>,
					]}
					itemClass="row-item"
					items={items}
					selectable={false}
					choiced={this.state.choicedValue}
					onChoice={handleChoiceValue}
					actions={this.valueActions}
					onEmpty={messageNoValuesDefinitions}
				/>

				<InfoBox
					className="valid-error no-float justify-content-center"
					icon={<Icon.ExclamationDiamond size="16" />}
					content={ValidationStore.formMessage("modal-examination", "values")}
				/>

				{this.state.modalAddValue && (
					<AddValue
						show={this.state.modalAddValue}
						onHide={() => {
							this.setState({ modalAddValue: false });
							this.validation();
						}}
					/>
				)}
				{this.state.modalEditValue !== false && (
					<EditValue
						show={this.state.modalEditValue !== false}
						valueData={ValuesStore.items.find((value) => value.id === this.state.choicedValue)}
						onHide={() => {
							this.setState({ modalEditValue: false });
							this.validation();
						}}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default observer(TabValues);
