import React, { Component } from 'react'
import { observer } from 'mobx-react';

import { Nav, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

import { ValuesTypesDef } from '../value/ValuesTypesDef';

function ValueItem ( props ) {
	const { value } = props;

	const valueSymbolize = ( value ) => {
		const def = ValuesTypesDef.find( def => def.type === value.type );
		return (
			<React.Fragment>
				{ value.required && <Icon.ExclamationCircleFill className="mr-1" />}
				<strong key="name" className="mr-1">{value.name}</strong>
				<span key="type" className="font-italic mr-1">{value.type}</span>

				{def ? def.symbolize( value ) : null}
				{value.description && <div>
					<Icon.ChatDots className="mr-1" />{value.description}
				</div>}
			</React.Fragment>
		)
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
		<div
			key={"value-item-" + value.id}
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

class ValuesList extends Component {
	render () {
		const items = this.props.items.filter( item => item.deleteOnUpdate !== true );

		return (
			<div className="d-flex flex-column">
				{items.length === 0
					? <div className="alert alert-info py-2 mt-2 text-center">
						<Icon.EmojiDizzy size="64" /><br />
					Brak definicji wartości określających badanie.
					</div>
					: items.map( value =>
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

export default observer( ValuesList )