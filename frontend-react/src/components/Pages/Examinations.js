import React, { Component } from "react";
import { observer } from "mobx-react";

import "./progressbar.scss";

import ExaminationsStore from "../../stores/examinations";
import GroupsStore from "../../stores/groups";
import ValuesStore from "../../stores/values";

import * as Icon from "react-bootstrap-icons";
import { Badge, Button, Dropdown } from "react-bootstrap";
import Media from "react-media";

import GroupsList from "./examinations/GroupsList";
import ExaminationsList from "./examinations/ExaminationsList";
import CombinedList from "./examinations/CombinedList";

import ModalExamination from "../Modals/Examination";
import ModalGroupEdit from "../Modals/GroupEdit";
import ModalExaminationViewOptions from "../Modals/Examination-ViewOptions";

const SilentFetchBar = observer(() => {
	if (
		[ExaminationsStore, GroupsStore, ValuesStore].find(
			(store) => store.state === "pending"
		)
	)
		return (
			<div className="progress bg-secondary custom-progress">
				<div className="indeterminate"></div>
			</div>
		);
	else return null;
});

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
			choicedGroup: null,
		};
	}

	/**
	 * Handle for item checkbox
	 * @param {Object} item - Object with item data
	 * @param {string} item.id - Unique item identificator
	 * @param {boolean} item.state - Item state (checked `true` or not `false`)
	 */
	handleSelectItem(item) {
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

	async doExaminationDelete(itemId) {
		console.log("delete item #" + itemId + "...");
		await ExaminationsStore.fetchDelete([itemId]);
	}

	async doDeleteSelected() {
		await ExaminationsStore.fetchDelete(this.state.selected);
		this.setState({ selected: [] });
	}

	async doGroupDelete(groupId) {
		this.setState({ selected: [] });
		await GroupsStore.fetchDelete([groupId]);
	}

	async prepareToEditItem(itemId) {
		console.log("Item edit #" + itemId);
		await ValuesStore.fetchGet(itemId);
		const examinationData = ExaminationsStore.getItemById(itemId);
		this.setState({
			examinationData,
			modalExamination: true,
		});
	}

	doGroupChoiced(groupId) {
		this.setState({ choicedGroup: groupId });
	}

	prepareToEditGroup(groupId) {
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

		return (
			<div style={{ paddingBottom: "5em" }}>
				<div className="mx-3 d-flex flex-row justify-content-between align-items-center border-bottom mb-2">
					<h4 className="">Lista badań</h4>
				</div>
				<SilentFetchBar />

				<Media
					query="(min-width:640px)"
					render={() => (
						<div className="d-flex flex-row">
							<div className="col-5">
								<GroupsList
									silentFetch={this.state.silentFetch}
									group={this.state.choicedGroup}
									onItemChoice={(groupId) => {
										this.doGroupChoiced(groupId);
									}}
									onItemEdit={(groupId) => {
										this.prepareToEditGroup(groupId);
									}}
									onItemDelete={(groupId) => {
										this.doGroupDelete(groupId);
									}}
								/>
							</div>
							<div className="col-7">
								<ExaminationsList
									silentFetch={this.state.silentFetch}
									group={this.state.choicedGroup}
									onSelect={(itemId) => {
										this.handleSelectItem(itemId);
									}}
									onItemEdit={(itemId) => {
										this.prepareToEditItem(itemId);
									}}
									onItemDelete={(itemId) => {
										this.doExaminationDelete(itemId);
									}}
								/>
							</div>
						</div>
					)}
				/>
				<Media
					query="(max-width:640px)"
					render={() => (
						<div className="d-flex flex-column d-md-none">
							<CombinedList
								silentFetch={this.state.silentFetch}
								onSelect={(itemId) => {
									this.handleSelectItem(itemId);
								}}
								onItemEdit={(itemId) => {
									this.prepareToEditItem(itemId);
								}}
								onItemDelete={(itemId) => {
									this.doExaminationDelete(itemId);
								}}
								onGroupEdit={(groupId) => {
									this.prepareToEditGroup(groupId);
								}}
								onGroupDelete={(groupId) => {
									this.doGroupDelete(groupId);
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

export default Examinations;
