import React, { Component } from 'react'
import { observer } from 'mobx-react';
import "./ExaminationsList.scss";

import ExaminationsStore from '../../stores/examinations';
import GroupsStore from '../../stores/groups';

import * as Icon from 'react-bootstrap-icons';
import { Alert, Button, Spinner, OverlayTrigger, Popover } from 'react-bootstrap';

function ListHeader () {
	return (
		<div className="d-flex flex-row justify-content-between align-items-center bg-primary text-white p-0">
			<button type="button" className="btn btn-flat shadow-none px-1 py-1 ml-0 text-white">
				Grupa/Nazwa badania
            </button>
			<button type="button" className="btn btn-flat shadow-none px-1 py-1 text-white">
				Ostatni pomiar
            </button>
		</div>
	)
}

/**
 * Show group header.
 * List is filtered by group id
 * @param {Object} props - Component properties
 * @param {Object} props.group - Group object definition
 * @param {string} props.group._id - Unique group identificator
 * @param {string} props.group.name - Group name
 * @param {string} [props.group.description] - Description to group
 */
function GroupHeader ( props ) {
	const { _id: id, name, description } = props.group;
	const ConfirmDelete = ( onConfirm ) => {
		return (
			<Popover id="popover-basic">
				<Popover.Title as="h3">Potwierdź operację</Popover.Title>
				<Popover.Content>
					<Button
						block
						variant="danger"
						size="sm"
						onClick={() => { onConfirm() }}
					>USUŃ</Button>
				</Popover.Content>
			</Popover>
		)
	}

	return (
		<div key={"group-header-" + id}
			className="row-item d-flex flex-row justify-content-between align-items-center w-100">
			<div className="px-2">
				<strong>{name}</strong>
				{description && <div className="text-truncate small">{description}</div>}
			</div>
			<nav>
				<Button
					variant="light"
					size="sm"
					className="p-2"
				><Icon.PencilSquare size="20" /></Button>
				<OverlayTrigger
					trigger="click"
					overlay={ConfirmDelete( () => { props.onDelete( id ) } )}
					placement="left"
					rootClose
				>
					<Button
						variant="light"
						size="sm"
						className="p-2"
					><Icon.Trash size="20" /></Button>
				</OverlayTrigger>
			</nav>
		</div>
	)
}

/**
 * Single entry of examination
 * @param {Object} props Component properties
 * @param {Object} props.item Examination object definition
 * @param {string} props.item._id Unique examination identificator
 * @param {string} props.item.name Examination name
 * @param {string} props.item.description Description to examination
 * @param {function} props.onSelect event for selecting item
 */
const ExaminationItem = observer( ( props ) => {
	const { _id: id, name, description } = props.item;

	const handleChange = ( e ) => {
		props.onSelect( { id, state: e.target.checked } );
	}

	const ConfirmDelete = ( onConfirm ) => {
		return (
			<Popover id="popover-basic">
				<Popover.Title as="h3">Potwierdź operację</Popover.Title>
				<Popover.Content>
					<Button
						block
						variant="danger"
						size="sm"
						onClick={() => { onConfirm() }}
					>USUŃ</Button>
				</Popover.Content>
			</Popover>
		)
	}

	return (
		<div className={"row-item " + ( props.inGroup ? "itemInGroup" : "" ) + " px-3 d-flex flex-row justify-content-between align-items-center"}>
			<div className="form-check">
				<input
					className="form-check-input"
					type="checkbox"
					name="selectedItems"
					onChange={handleChange}
				/>
				<div className="ml-3">
					<div>{name}</div>
					{description ?
						<div className="small text-muted">{description}</div> : null}
				</div>
			</div>
			<div className="d-flex flex-row justify-content-end ml-auto">
				<div className="latest-date"></div>
			</div>

			<nav>
				<Button
					variant="light"
					size="sm"
					className="p-2"
				><Icon.PencilSquare size="20" /></Button>
				<OverlayTrigger
					trigger="click"
					overlay={ConfirmDelete( () => { props.onDelete( id ) } )}
					placement="left"
					rootClose
				>
					<Button
						variant="light"
						size="sm"
						className="p-2"
					><Icon.Trash size="20" /></Button>
				</OverlayTrigger>
			</nav>

		</div>
	)
} );

class ExaminationsList extends Component {
	render () {
		const examinations = ExaminationsStore.items;
		const groups = [ null, ...GroupsStore.items ];
		let list;

		if ( examinations.length === 0 && groups.length === 1 ) {
			list = (
				<Alert variant="info" className="m-3 text-center">
					<Icon.EmojiFrown size="64" /><br />Brak zdefiniowanych badań i grup.
				</Alert>
			);
		} else
			list = groups.map( currentGroup => {
				let groupItems;

				if ( currentGroup === null ) {
					groupItems = examinations
						.filter( item => ( item.group === null ) )
						.map( itemWOGroup => {
							return (
								<ExaminationItem
									key={itemWOGroup._id}
									inGroup={this.props.inGroup}
									item={itemWOGroup}
									onSelect={this.props.onSelect}
									onDelete={this.props.onItemDelete}
								/>
							)
						} );

					return groupItems;
				}
				else {
					groupItems = examinations
						.filter( item => ( item.group === currentGroup._id ) )
						.map( itemInGroup => {
							return (
								<ExaminationItem
									key={itemInGroup._id}
									inGroup={this.props.inGroup}
									item={itemInGroup}
									onSelect={this.props.onSelect}
									onDelete={this.props.onItemDelete}
								/>
							)
						} );

					return (
						<React.Fragment key={currentGroup._id}>
							<GroupHeader
								group={currentGroup}
								onDelete={this.props.onGroupDelete}
							/>
							{groupItems.length === 0
								? <div className="alert alert-info my-2">
									<p className="mb-0">Ta grupa nie posiada żadnych badań</p>
								</div>
								: groupItems
							}
						</React.Fragment>
					)
				}
			} );

		if ( this.props.silentFetch ) {
			return ( <React.Fragment>
				<ListHeader />
				{( ExaminationsStore.state === "pending" || GroupsStore.state === "pending" ) &&
					<div className="progress bg-secondary custom-progress">
						<div className="indeterminate"></div>
					</div>}
				{list}
			</React.Fragment> )
		} else {
			return (
				<React.Fragment>
					<ListHeader />
					{( ExaminationsStore.state === "pending" || GroupsStore.state === "pending" )
						? <div className="d-flex flex-row justify-content-center align-items-center p-3">
							<Spinner animation="border" role="status" />
							<div className="ml-3">Wczytywanie danych</div>
						</div>
						: list
					}
				</React.Fragment>
			)
		}
	}
}

export default observer( ExaminationsList )