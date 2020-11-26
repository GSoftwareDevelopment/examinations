import React, { Component } from "react";
import { observer } from "mobx-react";

import ExaminationsStore from "../../stores/examinations";
import GroupsStore from "../../stores/groups";
import ValuesStore from "../../stores/values";

import * as Icon from "react-bootstrap-icons";
import Media from "react-media";

import InfoBox from "../Layout/InfoBox";
import { messageChoiceGroup } from "../Messages";
import { IconText, IconTextBadge } from "../Layout/IconText";

import FloatingActionButton from "../Layout/FloatingActionButton";
import { SelectionBadge } from "./examinations/FAB-components";
import ListWithActions from "../Layout/ListWithActions";

import CombinedList from "./examinations/CombinedList";

import ModalExamination from "../Modals/Examination";
import ModalGroupEdit from "../Modals/GroupEdit";
import ModalExaminationViewOptions from "../Modals/Examination-ViewOptions";

const HeaderExaminationsList = (props) => (
	<span>
		Lista badań
		{props.groupId !== null
			? " w grupie " + GroupsStore.getById(props.groupId).name
			: " nieprzypisanych do żadnej grupy"}
	</span>
);

class Examinations extends Component {
	state = {
		modalViewOption: false,
		modalExamination: false,
		modalGroupEdit: false,
		examinationData: null,
		selected: [],
		choicedItem: null,
		choicedGroup: null,
		choicedExamination: null,
	};

	groupActions = [
		{
			content: <IconText icon={<Icon.PencilSquare size="20" />} text="Edytuj grupę..." />,
			default: true,
			onClick: this.doEditGroup.bind(this),
		},
		{},
		{
			content: <IconText icon={<Icon.Trash size="20" />} text="Usuń grupę..." />,
			onClick: this.doDeleteGroup.bind(this),
		},
	];

	examinationActions = [
		{
			content: <IconText icon={<Icon.PencilSquare size="20" />} text="Edytuj badanie..." />,
			default: true,
			onClick: this.doEditExamination.bind(this),
		},
		{},
		{
			content: <IconText icon={<Icon.Trash size="20" />} text="Usuń badanie..." />,
			onClick: this.doDeleteExamination.bind(this),
		},
	];

	componentDidMount() {
		this.doRefreshList();
	}

	async doRefreshList() {
		await ExaminationsStore.fetchGet();
		await GroupsStore.fetchGet();
		this.setState({ selected: [] });
	}

	async doDeleteExamination(itemId) {
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

	async doDeleteGroup(groupId) {
		await GroupsStore.fetchDelete([groupId]);
		this.setState({
			selected: [],
			choicedExamination: null,
			choicedGroup: null,
			choicedItem: null,
		});
	}

	async doEditExamination(itemId) {
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

	doEditGroup(groupId) {
		console.log("Group edit #" + groupId);
		this.setState({
			choicedGroup: groupId,
			modalGroupEdit: true,
		});
	}

	render() {
		const showModalViewOptions = () => {
			this.setState({ modalViewOption: true });
		};
		const closeModalViewOptions = () => {
			this.setState({ modalViewOption: false });
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
		const handleChoiceGroup = (itemId) => {
			this.setState({ choicedGroup: itemId, choicedItem: itemId });
		};
		const handleChoiceItem = (itemId) => {
			this.setState({ choicedExamination: itemId, choicedItem: itemId });
		};

		const FAB = {
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
					text: <IconText icon={<Icon.SquareFill size="16" />} text="Zaznacz wszystkie" />,
					onClick: null,
				},
				{
					text: <IconText icon={<Icon.Square size="16" />} text="Odzaznacz wszystkie" />,
					onClick: null,
				},
				{
					text: <IconText icon={<Icon.SquareHalf size="16" />} text="Odwróć zaznaczenie" />,
					onClick: null,
				},
				{},
				{
					disabled: this.state.selected.length === 0,
					text: (
						<IconTextBadge
							icon={<Icon.Trash size="16" />}
							text="Usuń zaznaczone"
							badge={this.state.selected.length !== 0 ? this.state.selected.length : null}
						/>
					),
					onClick: this.doDeleteSelected.bind(this),
				},
				{},
				{
					text: <IconText icon={<Icon.Sliders size="16" />} text="Ustawienia widoku..." />,
					onClick: showModalViewOptions,
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
				<div className="mx-3 d-flex flex-row justify-content-between align-items-center border-bottom mb-2">
					<h4 className="">Lista badań</h4>
				</div>

				<Media queries={{ small: { maxWidth: 640 } }}>
					{(matches) =>
						matches.small ? (
							<div className="d-flex flex-column d-md-none">
								<CombinedList
									groups={groupsItems}
									items={ExaminationsStore.getItems()}
									groupsActions={this.groupActions}
									itemsActions={this.examinationActions}
									choiced={this.state.choicedItem}
									onChoiceGroup={handleChoiceGroup}
									onChoiceItem={handleChoiceItem}
									selectedItems={this.state.selected}
									onSelect={handleSelect}
								/>
							</div>
						) : (
							<div className="d-flex flex-row">
								<div className="col-5">
									<ListWithActions
										header="Lista grup"
										itemClass="row-group"
										items={groupsItems}
										selectable={false}
										choiced={this.state.choicedGroup}
										onChoice={handleChoiceGroup}
										actions={this.groupActions}
									/>
								</div>
								<div className="col-7">
									{this.state.choicedGroup === null &&
									ExaminationsStore.getItemsByGroupId(null).length === 0 ? (
										<InfoBox icon={<Icon.InfoSquare size="64" />} content={messageChoiceGroup} />
									) : (
										<ListWithActions
											header={<HeaderExaminationsList groupId={this.state.choicedGroup} />}
											itemClass="row-item"
											items={ExaminationsStore.getItemsByGroupId(this.state.choicedGroup)}
											selectable={true}
											selectedItems={this.state.selected}
											onSelect={handleSelect}
											choiced={this.state.choicedExamination}
											onChoice={handleChoiceItem}
											actions={this.examinationActions}
										/>
									)}
								</div>
							</div>
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
					dropdown={FAB}
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
				{this.state.modalViewOption && (
					<ModalExaminationViewOptions
						show={this.state.modalViewOption}
						onHide={closeModalViewOptions}
					/>
				)}
			</div>
		);
	}
}

export default observer(Examinations);
