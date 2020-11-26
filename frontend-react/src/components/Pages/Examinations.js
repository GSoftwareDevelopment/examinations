import React, { Component } from "react";
import { observer } from "mobx-react";

import ExaminationsStore from "../../stores/examinations";
import GroupsStore from "../../stores/groups";
import ValuesStore from "../../stores/values";

import * as Icon from "react-bootstrap-icons";
import { Badge } from "react-bootstrap";
import Media from "react-media";
import FloatingActionButton from "./examinations/FloatingActionButton";
import ListWithActions from "./examinations/ListWithActions";

import CombinedList from "./examinations/CombinedList";

import ModalExamination from "../Modals/Examination";
import ModalGroupEdit from "../Modals/GroupEdit";
import ModalExaminationViewOptions from "../Modals/Examination-ViewOptions";

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
			content: (
				<span>
					<Icon.PencilSquare size="20" /> Edytuj grupę...
				</span>
			),
			default: true,
			onClick: (itemId) => {
				this.doEditGroup(itemId);
			},
		},
		{},
		{
			content: (
				<span>
					<Icon.Trash size="20" /> Usuń grupę
				</span>
			),
			onClick: (itemId) => {
				this.doDeleteGroup(itemId);
			},
		},
	];

	examinationActions = [
		{
			content: (
				<span>
					<Icon.PencilSquare size="20" /> Edytuj badanie...
				</span>
			),
			default: true,
			onClick: (itemId) => {
				this.doEditExamination(itemId);
			},
		},
		{},
		{
			content: (
				<span>
					<Icon.Trash size="20" /> Usuń badanie
				</span>
			),
			onClick: (itemId) => {
				this.doDeleteExamination(itemId);
			},
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
		await ValuesStore.fetchGet(itemId);
		const examinationData = ExaminationsStore.getItemById(itemId);
		this.setState({
			examinationData,
			modalExamination: true,
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
		const closeViewOptionsModal = () => {
			this.setState({ modalViewOption: false });
		};
		const closeModalExamination = () => {
			this.setState({ modalExamination: false });
		};
		const closeModalGroupEdit = () => {
			this.setState({ modalGroupEdit: false });
		};

		const FAB = {
			trigger: {
				className: "m-0 rounded-circle noCaret badge-overlay",
				style: { paddingLeft: "5em", paddingRight: ".5em", zIndex: 0 },
				content: (
					<React.Fragment>
						<Icon.ThreeDotsVertical size="24" />
						{this.state.selected.length > 0 && (
							<Badge pill variant="danger">
								{this.state.selected.length}
							</Badge>
						)}
					</React.Fragment>
				),
			},
			header: "Akcje",
			items: [
				{
					text: "Odśwież widok",
					icon: <Icon.ArrowRepeat size="16" />,
					onClick: () => {
						this.doRefreshList();
					},
				},
				{},
				{
					text: "Zaznacz wszystkie",
					icon: <Icon.SquareFill size="16" />,
					onClick: null,
				},
				{
					text: "Odzaznacz wszystkie",
					icon: <Icon.Square size="16" />,
					onClick: null,
				},
				{
					text: "Odwróć zaznaczenie",
					icon: <Icon.SquareHalf size="16" />,
					onClick: null,
				},
				{},
				{
					className: "d-flex flex-row justify-content-between align-items-center",
					disabled: this.state.selected.length === 0,
					text: (
						<React.Fragment>
							<span>
								<Icon.Trash size="16" /> Usuń zaznaczone
							</span>
							{this.state.selected.length > 0 && (
								<Badge pill variant="danger">
									{this.state.selected.length}
								</Badge>
							)}
						</React.Fragment>
					),
					onClick: () => {
						this.doDeleteSelected();
					},
				},
				{},
				{
					text: "Ustawienia widoku...",
					icon: <Icon.Sliders size="16" />,
					onClick: () => {
						this.setState({ modalViewOption: true });
					},
				},
			],
		};

		const groupsItems = [...GroupsStore.getItems()];

		if (ExaminationsStore.getItemsByGroupId(null).length > 0)
			groupsItems.unshift({
				_id: null,
				name: "Bez grupy",
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
									onChoiceGroup={(itemId) => {
										this.setState({ choicedGroup: itemId, choicedItem: itemId });
									}}
									onChoiceItem={(itemId) => {
										this.setState({ choicedExamination: itemId, choicedItem: itemId });
									}}
									selectedItems={this.state.selected}
									onSelect={(itemsList) => {
										this.setState({ selected: itemsList });
									}}
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
										onChoice={(id) => {
											this.setState({ choicedGroup: id, choicedItem: id });
										}}
										actions={this.groupActions}
									/>
								</div>
								<div className="col-7">
									{this.state.choicedGroup === null &&
									ExaminationsStore.getItemsByGroupId(null).length === 0 ? (
										<div className="text-center">
											<Icon.InfoSquare size="64" />
											<div className="mt-4">
												Wybierz element z <strong>Listy grup</strong>, aby zobaczyć badania
												przypisane do tej grupy.
											</div>
										</div>
									) : (
										<ListWithActions
											header={
												<span>
													Lista badań
													{this.state.choicedGroup !== null
														? " w grupie " + GroupsStore.getById(this.state.choicedGroup).name
														: " nieprzypisanych do żadnej grupy"}
												</span>
											}
											itemClass="row-item"
											items={ExaminationsStore.getItemsByGroupId(this.state.choicedGroup)}
											selectable={true}
											selectedItems={this.state.selected}
											onSelect={(itemsList) => {
												this.setState({ selected: itemsList });
											}}
											choiced={this.state.choicedExamination}
											onChoice={(id) => {
												this.setState({ choicedExamination: id, choicedItem: id });
											}}
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
						onHide={closeViewOptionsModal}
					/>
				)}
			</div>
		);
	}
}

export default observer(Examinations);
