import React, { Component } from 'react'

import { Nav, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

function ValueItem ( props ) {
	const { value } = props;

	const valueSymbolize = ( value ) => (
		<React.Fragment>
			{ value.required
				? <strong className="mr-1">
					<Icon.ExclamationCircleFill className="mr-1" />
					{value.name}
				</strong>
				: <span className="mr-1">{value.name}</span>
			}
			<span className="font-italic mr-1">{value.type}</span>
			{ value.unit && <span className="mr-1">[{value.unit}]</span>}
			{ value.list &&
				<span className="mr-1">{'{'}
					{value.list.map( ( item, id, arr ) => <span>
						<u key={"value-list-item-" + id} className="mx-1 ">{item}</u>
						{( id !== ( arr.length - 1 ) ) && <span>,</span>}
					</span> )}
					{'}'}</span>
			}
			{value.description && <div>
				<Icon.ChatDots className="mr-1" />{value.description}
			</div>}
		</React.Fragment>
	)

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
		<div
			key={"value-" + value.id}
			className="row-value d-flex flex-row justify-content-between align-items-start">
			<div>{valueSymbolize( value )}</div>
			<Nav as="nav">
				<Button
					type="button"
					size="sm"
					variant="flat"
					className="my-0 px-2 shadow-none"
					onClick={() => { props.onClickEdit( value.id ) }}
				>
					<Icon.PencilSquare size="20" />
				</Button>
				<OverlayTrigger
					trigger="click"
					overlay={ConfirmDelete( () => { props.onClickDelete( value.id ); } )}
					placement="left"
					rootClose
				>
					<Button
						type="button"
						size="sm"
						variant="flat"
						className="my-0 px-2 shadow-none"
					>
						<Icon.Trash size="20" />
					</Button>
				</OverlayTrigger>
			</Nav>
		</div >
	)
}

export default class ValuesList extends Component {
	render () {
		return (
			<div className="d-flex flex-column">
				{this.props.items.length === 0
					? <div className="alert alert-info py-2 mt-2 text-center">
						<Icon.EmojiDizzy size="64" /><br />
					Brak definicji wartości określających badanie.
					</div>
					: this.props.items.map( value =>
						<ValueItem
							key={"value-" + value.id}
							value={value}
							onClickEdit={this.props.onClickEdit}
							onClickDelete={this.props.onClickDelete}
						/>
					)
				}
			</div>
		)
	}
}
