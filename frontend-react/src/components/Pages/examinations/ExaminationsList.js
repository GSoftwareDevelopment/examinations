import React, { Component } from "react";
import { observer } from "mobx-react";

import ExaminationsStore from "../../../stores/examinations";

import { Alert, Spinner } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import ListItem from "./ListItem";

function ListHeader() {
	return (
		<div className="d-flex flex-row justify-content-between align-items-center bg-dark text-white p-0">
			<button
				type="button"
				className="btn btn-flat shadow-none px-1 py-1 ml-0 text-white"
			>
				Nazwa badania
			</button>
		</div>
	);
}

class ExaminationsList extends Component {
	state = {
		choicedItem: null,
	};

	render() {
		const examinations = ExaminationsStore.getItemsByGroupId(this.props.group);
		let list;

		if (examinations.length === 0) {
			list = (
				<Alert variant="info" className="m-3 text-center">
					Brak zdefiniowanych badań.
				</Alert>
			);
		} else {
			list = examinations.map((item) => {
				return (
					<ListItem
						key={item._id}
						item={item}
						choiced={this.state.choicedItem === item._id}
						onChoiceItem={(examinationId) => {
							this.setState({ choicedItem: examinationId });
						}}
						selectable={true}
						onSelect={this.props.onSelect}
						actions={[
							{
								content: (
									<>
										<Icon.PencilSquare size="20" /> Edytuj badanie...
									</>
								),
								default: "onClick",
								on: {
									onClick: () => {
										this.props.onItemEdit(item._id);
									},
								},
							},
							{},
							{
								content: (
									<>
										<Icon.Trash size="20" /> Usuń badanie
									</>
								),
								on: {
									onClick: () => {
										this.props.onItemDelete(item._id);
									},
								},
							},
						]}
					/>
				);
			});
		}

		if (this.props.silentFetch) {
			return (
				<React.Fragment>
					<ListHeader />
					{list}
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<ListHeader />
					{ExaminationsStore.state === "pending" ? (
						<div className="d-flex flex-row justify-content-center align-items-center p-3">
							<Spinner animation="border" role="status" />
							<div className="ml-3"> Wczytywanie danych </div>
						</div>
					) : (
						list
					)}
				</React.Fragment>
			);
		}
	}
}

export default observer(ExaminationsList);
