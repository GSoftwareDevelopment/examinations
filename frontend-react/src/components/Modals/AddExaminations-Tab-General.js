import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import './AddExamination.scss';

import GroupsStore from '../../stores/groups';
import AddGroup from './AddGroup';

function TabGeneral ( props ) {
    const [ modalAddGroup, setModalAddGroup ] = useState( false );
    const [ validName, setValidName ] = useState( null );

    const validate = ( e ) => {
        const field = e.target.name, value = e.target.value;
        switch ( field ) {
            case 'name':
                setValidName( value.trim() !== '' )
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <Form.Group controlId="name" className="mt-3">
                <Form.Label>Nazwa badania</Form.Label>
                <Form.Control
                    type="text"
                    name={"name"}
                    required
                    autoFocus
                    onChange={( e ) => { props.onChange( e ); }}
                    onBlur={( e ) => { validate( e ); }}
                />
                {validName === false && <Form.Text className="text-danger">
                    Określ nazwę badania.
                </Form.Text>}
            </Form.Group>
            <Form.Group>
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <Form.Label htmlFor="group">Przypisz do grupy</Form.Label>
                    <Button
                        variant="light"
                        size="sm"
                        onClick={() => { setModalAddGroup( true ) }}
                    >Utwórz grupę</Button>
                </div>
                <Form.Control
                    as="select"
                    custom
                    defaultValue="DEFAULT"
                    name={"group"}
                    onChange={( e ) => { props.onChange( e ); }}
                >
                    {GroupsStore.items.length > 0
                        ? <option key="noGroup" value="DEFAULT">Nie przypisuj do żadnej grupy</option>
                        : <option key="empty" value="DEFAULT" disabled={true}>Brak zdefiniowanych grup</option>
                    }
                    {GroupsStore.items.map( group =>
                        <option key={group._id} value={group._id}>{group.name}</option>
                    )}
                </Form.Control>
            </Form.Group>
            <Form.Group className="form-group">
                <Form.Label htmlFor="description">Opis</Form.Label>
                <Form.Control
                    as="textarea"
                    rows="3"
                    name={"description"}
                    onChange={( e ) => { props.onChange( e ); }}
                ></Form.Control>
            </Form.Group>
            {modalAddGroup &&
                <AddGroup
                    show={modalAddGroup}
                    onHide={() => { setModalAddGroup( false ) }}
                />}
        </div>
    )
}

export default TabGeneral