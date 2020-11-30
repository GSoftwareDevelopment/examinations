import React, { Component } from "react";
import Media from "react-media";
import { observer } from "mobx-react";

import ExaminationsStore from "../../stores/examinations";
import GroupsStore from "../../stores/groups";
import ValuesStore from "../../stores/values";

import * as Icon from "react-bootstrap-icons";


import { IconText, IconTextBadge } from "../Layout/IconText";

import FloatingActionButton from "../Layout/FloatingActionButton";
import { SelectionBadge } from "./examinations/FAB-components";

import PageHeader from "../Layout/PageHeader";
import TwoColumnsList from "./examinations/TwoColumnsList";
import CombinedList from "./examinations/CombinedList";

import ModalExamination from "../Modals/Examination";
import ModalGroupEdit from "../Modals/GroupEdit";
import ModalGroupManage from "../Modals/GroupManage";

class Examinations extends Component {
	state = {
		modalGroupManage: false,
		modalExamination: false,
		modalGroupEdit: false,
		examinationData: null,
		selected: [],
		choicedItem: null,
		choicedGroup: null,
		choicedExamination: null,
	};

	componentDidMount() {
		this.doRefreshList();
	}

	async doRefreshList() {
		await ExaminationsStore.fetchGet();
		await GroupsStore.fetchGet();
		this.setState({ selected: [] });
	}

	async doEditExamination() {
		const itemId = this.state.choicedExamination;
		console.log("Item edit #" + itemId);
		await ValuesStore.fetchGet(itemId).finally(() => {
			if (ValuesStore.getState() === "done") {
				const examinationData = ExaminationsStore.getItemById(itemId);
				this.setState({
					examinationData,
					modalExamination: true,
				});
			}
		});
	}

	async doDeleteExamination() {
		const itemId = this.state.choicedExamination;
		console.log("delete item #" + itemId + "...");
		await ExaminationsStore.fetchDelete([itemId]);
		this.setState({
			selected: [],
			choicedExamination: null,
			choicedItem: this.state.choicedGroup,
		});
	}

	async doDeleteSelected() {
		await ExaminationsStore.fetchDelete(this.state.selected);
		this.setState({ selected: [] });
	}

	doEditGroup() {
		const groupId = this.state.choicedGroup;
		console.log("Group edit #" + groupId);
		this.setState({
			choicedGroup: groupId,
			modalGroupEdit: true,
		});
	}

	async doDeleteGroup() {
		const groupId = this.state.choicedGroup;
		await GroupsStore.fetchDelete([groupId]);
		this.setState({
			selected: [],
			choicedExamination: null,
			choicedGroup: null,
			choicedItem: null,
		});
	}

	render() {
		const showModalGroupManage = () => {
			this.setState({ modalGroupManage: true });
		};
		const closeModalGroupManage = () => {
			this.setState({ modalGroupManage: false });
		};
		const closeModalExamination = () => {
			this.setState({ modalExamination: false });
		};
		const closeModalGroupEdit = () => {
			this.setState({ modalGroupEdit: false });
		};
		const handleSelect = (itemsList) => {
			this.setState({ selected: itemsList });
		};
		const handleChoiceItem = (itemId) => {
			this.setState({ choicedItem: itemId });

			// check itemId is a Group
			const isGroup = GroupsStore.getById(itemId);
			if (isGroup) {
				this.setState({ choicedGroup: itemId });
			}

			// check itemId is a Examination
			const isExamination = ExaminationsStore.getItemById(itemId);
			if (isExamination) {
				this.setState({ choicedGroup: isExamination.group, choicedExamination: itemId });
			} else {
				this.setState({ choicedExamination: null });
			}
		};

		const isItemsSelected = this.state.selected.length > 0;

		const disabledExaminationActions =
			this.state.choicedExamination === null ||
			this.state.choicedExamination !== this.state.choicedItem;

		const disabledGroupActions =
			this.state.choicedGroup === null || this.state.choicedGroup !== this.state.choicedItem;

		const FABActions = {
			trigger: {
				className: "m-0 rounded-circle noCaret badge-overlay",
				style: { paddingLeft: "5em", paddingRight: ".5em", zIndex: 0 },
				content: (
					<React.Fragment>
						<Icon.ThreeDotsVertical size="24" />
						<SelectionBadge value={this.state.selected.length} />
					</React.Fragment>
				),
			},
			header: "Akcje",
			items: [
				{
					text: <IconText icon={<Icon.ArrowRepeat size="16" />} text="Odśwież widok" />,
					onClick: this.doRefreshList.bind(this),
				},
				{},
				{
					disabled: disabledGroupActions,
					text: <IconText icon={<Icon.PencilSquare size="16" />} text="Edytuj grupę..." />,
					onClick: this.doEditGroup.bind(this),
				},
				{
					disabled: disabledGroupActions,
					text: <IconText icon={<Icon.Trash size="16" />} text="Usuń grupę" />,
					onClick: this.doDeleteGroup.bind(this),
				},
				{},
				{
					disabled: disabledExaminationActions,
					text: <IconText icon={<Icon.PencilSquare size="16" />} text="Edytuj badanie..." />,
					onClick: this.doEditExamination.bind(this),
				},
				{
					disabled: disabledExaminationActions || isItemsSelected,
					text: <IconText icon={<Icon.Trash size="16" />} text="Usuń badanie" />,
					onClick: this.doDeleteExamination.bind(this),
				},
				{},
				{
					disabled: !isItemsSelected,
					text: (
						<IconTextBadge
							icon={<Icon.Trash size="16" />}
							text="Usuń zaznaczone"
							badge={isItemsSelected ? this.state.selected.length : null}
						/>
					),
					onClick: this.doDeleteSelected.bind(this),
				},
				{},
				{
					text: <IconText icon={<Icon.Diagram3 size="16" />} text="Zarządzanie grupami..." />,
					onClick: showModalGroupManage,
				},
			],
		};

		const groupsItems = [...GroupsStore.getItems()];

		if (ExaminationsStore.getItemsByGroupId(null).length > 0)
			groupsItems.unshift({
				_id: null,
				name: "[ Bez grupy ]",
				description: "Badnia bez przydzielonej grupy",
			});

		return (
			<div style={{ paddingBottom: "5em" }}>
				<PageHeader name="Administrowanie badaniami" />

				<Media queries={{ small: { maxWidth: 575 } }}>
					{(matches) =>
						matches.small ? (
							<CombinedList
								groups={groupsItems}
								items={ExaminationsStore.getItems()}
								choiced={this.state.choicedItem}
								onChoiceItem={handleChoiceItem}
								selectedItems={this.state.selected}
								onSelect={handleSelect}
							/>
						) : (
							<TwoColumnsList
								groups={groupsItems}
								items={ExaminationsStore.getItemsByGroupId(this.state.choicedGroup)}
								choiced={this.state.choicedItem}
								choicedGroup={this.state.choicedGroup}
								onChoiceItem={handleChoiceItem}
								selectedItems={this.state.selected}
								onSelect={handleSelect}
							/>
						)
					}
				</Media>

				<FloatingActionButton
					mainActionContent={<Icon.Plus size="48" />}
					onClick={() => {
						this.setState({
							examinationData: null,
							modalExamination: true,
						});
					}}
					dropdown={FABActions}
				/>

				{this.state.modalExamination && (
					<ModalExamination
						show={this.state.modalExamination}
						setTo={this.state.examinationData}
						onHide={closeModalExamination}
					/>
				)}
				{this.state.modalGroupEdit && (
					<ModalGroupEdit
						show={this.state.modalGroupEdit}
						groupId={this.state.choicedGroup}
						onHide={closeModalGroupEdit}
					/>
				)}
				{this.state.modalGroupManage && (
					<ModalGroupManage show={this.state.modalGroupManage} onHide={closeModalGroupManage} />
				)}
			</div>
		);
	}
}

export default observer(Examinations);
