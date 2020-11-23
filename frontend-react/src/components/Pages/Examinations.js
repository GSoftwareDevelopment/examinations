import React, { Component } from "react";
import { observer } from "mobx-react";

import ExaminationsStore from "../../stores/examinations";
import GroupsStore from "../../stores/groups";
import ValuesStore from "../../stores/values";

import * as Icon from "react-bootstrap-icons";
import { Alert, Badge, Button, Dropdown } from "react-bootstrap";
import Media from "react-media";
import ListWithActions from "./examinations/ListWithActions";

import CombinedList from "./examinations/CombinedList";

import ModalExamination from "../Modals/Examination";
import ModalGroupEdit from "../Modals/GroupEdit";
import ModalExaminationViewOptions from "../Modals/Examination-ViewOptions";

class Examinations extends Component {
	constructor() {
		super();

		this.state = {
			modalViewOption: false,
			modalExamination: false,
			modalGroupEdit: false,
			examinationData: null,
			silentFetch: false,
			selected: [],
			choicedItem: null,
			choicedGroup: null,
			choicedExamination: null,
		};
	}

	/**
	 * Handle for item checkbox
	 * @param {Object} item - Object with item data
	 * @param {string} item.id - Unique item identificator
	 * @param {boolean} item.state - Item state (checked `true` or not `false`)
	 */
	doSelectExamination(item) {
		let list = this.state.selected;
		if (item.state) {
			list.push(item.id);
			this.setState({ selected: list });
		} else {
			list = list.filter((id) => id !== item.id);
			this.setState({ selected: list });
		}
	}

	componentDidMount() {
		this.doRefreshList().finally(() => {
			this.setState({ silentFetch: true });
		});
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

		const groupActions = [
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

		const examinationActions = [
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

				<Media
					query="(min-width:641px)"
					render={() => (
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
									actions={groupActions}
								/>
							</div>
							<div className="col-7">
								{this.state.choicedGroup === null &&
								ExaminationsStore.getItemsByGroupId(null).length === 0 ? (
									<div className="text-center">
										<Icon.InfoSquare size="64" />
										<div className="mt-4">
											Wybierz element z <strong>Listy grup</strong>, aby zobaczyć badania przypisane
											do tej grupy.
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
										onSelect={(select) => {
											this.doSelectExamination(select);
										}}
										choiced={this.state.choicedExamination}
										onChoice={(id) => {
											this.setState({ choicedExamination: id, choicedItem: id });
										}}
										actions={examinationActions}
									/>
								)}
							</div>
						</div>
					)}
				/>
				<Media
					query="(max-width:640px)"
					render={() => (
						<div className="d-flex flex-column d-md-none">
							<CombinedList
								groups={groupsItems}
								items={ExaminationsStore.getItems()}
								groupsActions={groupActions}
								itemsActions={examinationActions}
								choiced={this.state.choicedItem}
								onChoiceGroup={(itemId) => {
									this.setState({ choicedGroup: itemId, choicedItem: itemId });
								}}
								onChoiceItem={(itemId) => {
									this.setState({ choicedExamination: itemId, choicedItem: itemId });
								}}
								onSelect={(itemId) => {
									this.handleSelectItem(itemId);
								}}
							/>
						</div>
					)}
				/>

				<nav className="cornerButton">
					<Button
						className="rounded-circle p-2 m-0"
						style={{ transform: "translateX(+5em)", zIndex: 2 }}
						variant="primary"
						onClick={() => {
							this.setState({
								examinationData: null,
								modalExamination: true,
							});
						}}
					>
						<Icon.Plus size="48" />
					</Button>

					<Dropdown drop="up">
						<Dropdown.Toggle
							variant="light"
							id="dropdown-basic"
							className="m-0 rounded-circle noCaret badge-overlay"
							style={{ paddingLeft: "5em", paddingRight: ".5em", zIndex: 0 }}
						>
							<Icon.ThreeDotsVertical size="24" />
							{this.state.selected.length > 0 && (
								<Badge pill variant="danger">
									{this.state.selected.length}
								</Badge>
							)}
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Header>Akcje</Dropdown.Header>
							<Dropdown.Item
								onClick={() => {
									this.doRefreshList();
								}}
							>
								<Icon.ArrowRepeat size="16" /> Odśwież widok
							</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item eventKey="1">
								<Icon.SquareFill className="mr-2" />
								Zaznacz wszystkie
							</Dropdown.Item>
							<Dropdown.Item eventKey="2">
								<Icon.Square className="mr-2" />
								Odznacz wszystkie
							</Dropdown.Item>
							<Dropdown.Item eventKey="3">
								<Icon.SquareHalf className="mr-2" />
								Odwróć zaznaczenie
							</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item
								className="d-flex flex-row justify-content-between align-items-center"
								disabled={this.state.selected.length === 0}
								onClick={() => {
									this.doDeleteSelected();
								}}
							>
								<span>
									<Icon.Check2Square size="20" /> Usuń wybrane
								</span>
								{this.state.selected.length > 0 && (
									<Badge pill variant="danger">
										{this.state.selected.length}
									</Badge>
								)}
							</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item
								onClick={() => {
									this.setState({ modalViewOption: true });
								}}
							>
								<Icon.Sliders size="20" /> Ustawienia widoku...
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</nav>

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
