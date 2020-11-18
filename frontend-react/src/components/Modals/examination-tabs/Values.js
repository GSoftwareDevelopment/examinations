import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Button } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

import ValuesStore from '../../../stores/values';
import ValidationStore from '../../../stores/validation';

import ValuesList from './ValuesList';
import AddValue from '../AddValue';
import EditValue from '../EditValue';

class TabValues extends Component {
	state = {
		modalAddValue: false,
		editedValueId: false,
	}

	validation () {
		const values = ValuesStore.getItems();
		if ( values.length > 0 ) {
			ValidationStore.setField( 'modal-examination', 'values', true );
		} else {
			ValidationStore.setField( 'modal-examination', 'values', 'Badanie musi zawierać przynajmniej jedną definicję wartości' );
		}
	}

	render () {
		return ( <React.Fragment>
			{ValidationStore.formMessage( 'modal-examination', 'values' )}

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