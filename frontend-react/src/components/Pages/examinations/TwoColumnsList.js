import React, { Component } from "react";
import { observer } from "mobx-react";

import GroupsStore from "../../../stores/groups";
import ExaminationsStore from "../../../stores/examinations";

import { messageChoiceGroup, messageGroupHasntExaminations } from "../../Layout/Messages";
import ListWithActions from "../../Layout/ListWithActions";

const examinationsHeader = (groupId) => {
	const group = GroupsStore.getById(groupId);
	if (group) {
		return [
			`Lista badań ${
				groupId !== null ? " w grupie " + group.name : " nieprzypisanych do żadnej grupy"
			}`,
		];
	} else {
		return ["Lista badań"];
	}
};

const GroupList = observer((props) => (
	<div className="col-5">
		<ListWithActions
			header={["Lista grup"]}
			itemClass="row-item"
			selectable={false}
			items={props.items}
			choiced={props.choiced}
			onChoice={props.onChoice}
		/>
	</div>
));

const ExaminationList = observer((props) => (
	<div className="col-7">
		{props.choiced === null && ExaminationsStore.getItemsByGroupId(null).length === 0 ? (
			messageChoiceGroup
		) : (
			<ListWithActions
				header={examinationsHeader(props.choicedGroup)}
				itemClass="row-item"
				selectable={true}
				items={props.items}
				selectedItems={props.selectedItems}
				onSelect={props.onSelect}
				choiced={props.choiced}
				onChoice={props.onChoice}
				onEmpty={messageGroupHasntExaminations}
			/>
		)}
	</div>
));

class TwoColumnsList extends Component {
	render() {
		return (
			<div className="d-flex flex-row">
				<GroupList
					items={this.props.groups}
					choiced={this.props.choiced}
					onChoice={this.props.onChoiceItem}
				/>
				<ExaminationList
					items={this.props.items}
					selectedItems={this.props.selectedItems}
					onSelect={this.props.onSelect}
					choiced={this.props.choiced}
					onChoice={this.props.onChoiceItem}
					choicedGroup={this.props.choicedGroup}
				/>
			</div>
		);
	}
}

export default TwoColumnsList;
