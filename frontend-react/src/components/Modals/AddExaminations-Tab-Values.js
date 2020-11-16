import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './AddExamination.scss';

import { Nav, Form, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

import ValuesStore from '../../stores/values';
import ValidationStore from '../../stores/validation';

import AddValue from './AddValue';
import EditValue from './EditValue';

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
		<div className="row-value d-flex flex-row justify-content-between align-items-start">
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

function ValuesList ( props ) {
	return (
		<div className="d-flex flex-column">
			{props.items.length === 0 ?
				<div className="alert alert-info py-2 mt-2 text-center">
					<Icon.EmojiDizzy size="64" /><br />
					Brak definicji wartości określających badanie.
				</div> :
				props.items.map( value =>
					<ValueItem
						key={"value-" + value.id}
						value={value}
						onClickEdit={props.onClickEdit}
						onClickDelete={props.onClickDelete}
					/>
				)
			}
		</div>
	)
}

class TabValues extends Component {
	state = {
		modalAddValue: false,
		editedValueId: false,
		validation: false,
	}

	validation () {
		const values = ValuesStore.getItems();
		if ( values.length > 0 ) {
			this.setState( { validation: true } );
			ValidationStore.setField( 'add-examination', 'values', true );
		} else {
			this.setState( { validation: 'Badanie musi zawierać przynajmniej jedną definicję wartości' } );
			ValidationStore.setField( 'add-examination', 'values', 'Badanie musi zawierać przynajmniej jedną definicję wartości' );
		}
	}

	render () {
		return ( <React.Fragment>
			{this.state.validation !== false && this.state.validation !== true &&
				<Form.Text className="text-danger">{this.state.validation}</Form.Text>}

			<div className="d-flex flex-row align-items-center bg-dark text-white p-2 mt-3">
				<div>Definicje</div>
			</div>

			<ValuesList
				items={ValuesStore.getItems()}
				onClickEdit={( id ) => { this.setState( { editedValueId: id } ); }}
				onClickDelete={( id ) => { ValuesStore.remove( id ); this.validation(); }}
			/>

			<div className="d-flex flex-column justify-content-start align-items-end border-top py-2">
				<Button
					onClick={() => { this.setState( { modalAddValue: true } ); }}
					variant="light"
					size="sm">
					<Icon.PlusCircle size="16" className="mr-1" />
					Dodaj definicje...
				</Button>
			</div>

			{
				this.state.modalAddValue &&
				<AddValue
					show={this.state.modalAddValue}
					onHide={() => {
						this.setState( { modalAddValue: false } );
						this.validation();
					}}
				/>
			}
			{
				this.state.editedValueId !== false &&
				<EditValue
					show={this.state.editedValueId !== false}
					valueData={this.state.editedValueId !== false
						? ValuesStore.items[ this.state.editedValueId ]
						: null}
					onHide={() => {
						this.setState( { editedValueId: false } );
						this.validation();
					}}
				/>
			}
		</React.Fragment > )
	}
}

export default observer( TabValues );