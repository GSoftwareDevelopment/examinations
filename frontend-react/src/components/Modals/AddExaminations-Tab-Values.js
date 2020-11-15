import React, { useState } from 'react'
import { Form, Nav, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

import './AddExamination.scss';

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
                    onClick={() => { props.onShowEdit( value.id ) }}
                >
                    <Icon.PencilSquare size="20" />
                </Button>
                <OverlayTrigger
                    trigger="click"
                    overlay={ConfirmDelete( () => { props.onDelete( value.id ) } )}
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
            {props.values.length === 0 ?
                <div className="alert alert-info py-2 mt-2 text-center">
                    <Icon.EmojiDizzy size="64" /><br />
                    Brak definicji wartości określających badanie.
                </div> :
                props.values.map( value =>
                    <ValueItem
                        key={"value-" + value.id}
                        value={value}
                        onShowEdit={props.onShowEdit}
                        onDelete={props.onDelete}
                        onUpdate={props.onUpdate}
                    />
                )
            }
        </div>
    )
}

function TabValues ( props ) {
    const [ modalAddValue, setModalAddValue ] = useState( false );
    const [ editedValueId, setEditedValueId ] = useState( false );

    return ( <React.Fragment>
        <div className="d-flex flex-row align-items-center bg-dark text-white p-2 mt-3">
            <div>Definicje</div>
        </div>

        <ValuesList
            values={props.values}
            onDelete={( id ) => { props.onDelete( id ); }}
            onShowEdit={( id ) => { setEditedValueId( id ); }}
        />

        <div className="d-flex flex-column justify-content-start align-items-end border-top py-2">
            {props.values.length === 0 &&
                <Form.Text className="text-danger align-items-center">
                    <Icon.ExclamationDiamond className="mr-2" />
                Zdefiniuj przynajmniej jedną wartość.
            </Form.Text>}
            <Button
                onClick={() => { setModalAddValue( true ) }}
                variant="light"
                size="sm">
                <Icon.PlusCircle size="16" className="mr-1" />
                    Dodaj definicje...
                </Button>
        </div>

        {modalAddValue &&
            <AddValue
                show={modalAddValue}
                onAdd={( data ) => { props.onAdd( data ) }}
                onHide={() => { setModalAddValue( false ); }}
            />
        }
        {editedValueId !== false &&
            <EditValue
                show={editedValueId !== false}
                valueData={editedValueId !== false
                    ? props.values[ editedValueId ]
                    : null}
                onUpdate={props.onUpdate}
                onHide={() => { setEditedValueId( false ); }}
            />
        }
    </React.Fragment> )
}

export default TabValues;