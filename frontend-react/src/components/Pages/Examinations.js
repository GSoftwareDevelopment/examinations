import React, { Component } from 'react'
import ExaminationsStore from '../../stores/examinations';
import GroupsStore from '../../stores/groups';

import * as Icon from 'react-bootstrap-icons';
import {
    Badge,
    Button,
    Dropdown,
} from 'react-bootstrap';

import ExaminationsList from '../ExaminationsList';
import AddExamination from '../Modals/AddExamination';
import ExaminationViewOptions from '../Modals/ExaminationViewOptions';

class Examinations extends Component {
    constructor() {
        super();

        this.state = {
            modalViewOption: false,
            modalAddExamination: false,
            selected: []
        }
    }

    /**
     * Handle for item checkbox
     * @param {Object} item - Object with item data
     * @param {string} item.id - Unique item identificator
     * @param {boolean} item.state - Item state (checked `true` or not `false`)
     */
    handleSelectItem ( item ) {
        let list = this.state.selected;
        if ( item.state ) {
            list.push( item.id );
            this.setState( { selected: list } );
        } else {
            list = list.filter( id => ( id !== item.id ) );
            this.setState( { selected: list } )
        }
    }

    async doRefreshList () {
        this.setState( { selected: [] } );
        await ExaminationsStore.fetchGet();
        await GroupsStore.fetchGet();
    }

    async doDeleteSelected () {
        await ExaminationsStore.fetchDelete( this.state.selected );
        this.setState( { selected: [] } );
    }

    async doGroupDelete ( groupId ) {
        this.setState( { selected: [] } );
        await GroupsStore.fetchDelete( [ groupId ] );
    }

    render () {
        const closeViewOptionsModal = () => { this.setState( { modalViewOption: false } ) }
        const closeAddExaminationModal = () => { this.setState( { modalAddExamination: false } ) }

        return (
            <div style={{ paddingBottom: "5em" }}>
                <div className="d-flex flex-row justify-content-between align-items-center border-bottom mb-2">
                    <h4 className="">Lista badań</h4>
                </div>

                <ExaminationsList
                    onSelect={( itemId ) => { this.handleSelectItem( itemId ) }}
                    onGroupDelete={( groupId ) => { this.doGroupDelete( groupId ) }}
                />

                <nav className="d-flex flex-row justify-content-end align-items-center m-3 fixed-bottom">

                    <Button
                        className="rounded-circle p-2 m-0"
                        style={{ transform: "translateX(+5em)", zIndex: 2 }}
                        variant="primary"
                        onClick={() => { this.setState( { modalAddExamination: true } ) }}
                    >
                        <Icon.Plus size="48" />
                    </Button>

                    <Dropdown>
                        <Dropdown.Toggle
                            variant="light"
                            id="dropdown-basic"
                            className="m-0 rounded-circle noCaret badge-overlay"
                            style={{ paddingLeft: "5em", paddingRight: ".5em", zIndex: 0 }}>
                            <Icon.ThreeDotsVertical size="24" />
                            {this.state.selected.length > 0 &&
                                <Badge pill variant="danger" >{this.state.selected.length}</Badge>
                            }
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Header>Akcje</Dropdown.Header>
                            <Dropdown.Item
                                onClick={() => { this.doRefreshList(); }}>
                                <Icon.ArrowRepeat size="16" /> Odśwież widok</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="1">
                                <Icon.SquareFill className="mr-2" />Zaznacz wszystkie
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="2">
                                <Icon.Square className="mr-2" />Odznacz wszystkie
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="3">
                                <Icon.SquareHalf className="mr-2" />Odwróć zaznaczenie
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                className="d-flex flex-row justify-content-between align-items-center"
                                disabled={this.state.selected.length === 0}
                                onClick={() => { this.doDeleteSelected() }}>
                                <span><Icon.Check2Square size="20" /> Usuń wybrane</span>
                                {this.state.selected.length > 0 &&
                                    <Badge pill variant="danger">{this.state.selected.length}</Badge>
                                }</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                onClick={() => { this.setState( { modalViewOption: true } ) }}>
                                <Icon.Sliders size="20" /> Ustawienia widoku...</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </nav>

                {this.state.modalAddExamination &&
                    <AddExamination
                        show={this.state.modalAddExamination}
                        onHide={closeAddExaminationModal}
                    />}
                {this.state.modalViewOption &&
                    <ExaminationViewOptions
                        show={this.state.modalViewOption}
                        onHide={closeViewOptionsModal}
                    />}
            </div>
        )
    }
}

export default Examinations