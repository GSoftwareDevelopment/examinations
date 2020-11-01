import './style.scss';

import apiRoutes from '../../api-routes';

import { Pages } from 'gsd-minix/class-pages';
// import { Main } from '../main/main';

import { Fetcher } from 'gsd-minix/class-fetcher';

import { AddNewExamination } from './modals/newExamination';
import { CreateNewValue } from './modals/createNewValue';
import { CreateGroup } from './modals/createGroup';
import { ListViewOptions } from './modals/listViewOptions';

import { Dropdown, MessageBox } from 'gsd-minix/components';

import { formatDate, formatTime } from '../../utils/misc';

import ExaminationsListTemplate from './templates/examinationsList.hbs';
import ViewOptionsMenu from './templates/_viewOptionsMenu.hbs';
import PageBody from './body.hbs';

export class Examinations extends Pages {
    constructor( opt ) {
        super( {
            parentPage: opt.App.redirect( '/' ),
            HTMLBody: PageBody(),
            ...opt
        } );

        this.modal = {
            listViewOptions: new ListViewOptions( this ),
            addNewExamination: new AddNewExamination( this ),
            createValue: new CreateNewValue( this ),
            createGroup: new CreateGroup( this )
        }

        const menuListOption = new Dropdown(
            $( ViewOptionsMenu() ),
            {
                triggerElement: $( this.elements[ 'btn-listOption' ] ),
                triggerSelectro: 'a',
                triggers: {
                    "listOption-refresh": ( e ) => { this.refreshList( e ); },
                    "listOption-deleteSelected": ( e ) => { this.deleteSelected( e ); },
                }
            }, this );

        this.table = $( this.elements[ 'examinationTable' ] );
        this.api = new Fetcher( apiRoutes.examinationList, { method: "GET" } );

        this.refreshList();
    }

    onShow () {
        this.refreshList();
    }

    refreshList () {
        $( this.elements[ 'examinationFetch' ] ).show();

        const conf = this.modal[ 'listViewOptions' ].options;

        this.api.getJSON()
            .then( ( data ) => {
                // this.table.empty();
                this.table.html( ExaminationsListTemplate( {
                    conf, lists: data.lists, groups: data.groups
                } ) );

                this.getLatestDates();
            } )
            .finally( () => {
                $( this.elements[ 'examinationFetch' ] ).hide();
            } );
    }

    getLatestDates () {
        const conf = this.modal[ 'listViewOptions' ].options;

        if ( conf[ 'fetch-latest' ] ) {

            this.table
                .find( `div.row-item` )
                .each( ( index, el ) => {
                    const id = el.dataset.item;
                    const html = $( el ).find( 'div.latest-date' );

                    new Fetcher(
                        apiRoutes.measurementLatest + `?examinationId=${id}`,
                        { method: 'GET' }
                    )
                        .getJSON()
                        .then( ( data ) => {
                            if ( data.length ) {
                                const latestDate = new Date( data[ 0 ].createdAt );
                                html.text( formatDate( latestDate ) + ' @ ' + formatTime( latestDate ) )
                            } else
                                html.text( '-' )
                        } )
                        .catch( ( error ) => {
                            console.log( error );
                        } );
                } );
        }
    }

    deleteEntry ( e ) {
        const el = $( e.currentTarget ).parents( 'tr' );
        const entryID = el.data( 'item' );

        el.detach();

        this.fetchDeleteEntry( [ entryID ] );
    }

    deleteSelected ( e ) {
        const selected = this.table.find( 'input[type="checkbox"]:checked' );
        const ids = selected.map( ( i, el ) => $( el ).parents( 'div.row' ).data( 'item' ) ).get();

        if ( !ids.length ) {
            new MessageBox( null, {
                type: 'info',
                title: 'Nie ma wybranych elementów',
                message: 'Aby wykonać operację, konieczne jest wybranie przynajmniej jednego elementu z listy.',
                buttons: [
                    { id: 'understand', class: 'btn-info', text: 'Rozumiem' }
                ]
            } );
            return;
        }

        new MessageBox( null, {
            type: 'warning',
            title: 'Operacja nieodwracalna',
            message: `Czy na pewno chcesz usunąć wybrane elementy?`,
            buttons: [
                {
                    id: 'cancel', class: 'btn-secondary', text: 'Anuluj'
                },
                {
                    id: 'delete', class: 'btn-primary', text: 'Usuń',
                    onClick: () => {
                        selected
                            .each( ( i, el ) => {
                                const obj = $( el ).parents( 'div.row' )[ 0 ];
                                obj.style.backgroundColor = "yellow";
                                $( obj )
                                    .animate( { opacity: 0 }, 500, () => {
                                        $( obj ).detach();
                                    } )
                            } );

                        this.fetchDeleteEntry( ids );
                    }
                }
            ]
        } );
    }

    async fetchDeleteEntry ( itemsList ) {
        try {
            let response = await fetch( apiRoutes.examinationList, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( itemsList ),
            } );
            // TODO: Add notification about deleting entry(s)
        } catch ( error ) {
            console.log( error );
        }
    }

    // Groups

    deleteGroup ( e ) {
        const el = $( e.currentTarget ).parents( 'div.row' );
        const groupID = el.data( 'group' );

        // TODO: zmień to na referencje (this.modal[...]) związaną ze stroną.
        $( '#modal-confirmGroupDelete' ).modal( 'show' );

        $( 'button#btn-confirmGroupDelete' ).off().on( 'click', ( e ) => {
            $( this.elements[ 'form-list' ] )
                // TODO: v-- do zmiany 
                .find( `tr` ).each( ( i, el ) => {
                    const id = $( el ).data( 'group' );
                    if ( id === groupID ) $( el ).detach();
                } );

            this.fetchDeleteGroup( [ groupID ] );
        } )

    }

    async fetchDeleteGroup ( groupList ) {
        try {
            let response = await fetch( apiRoutes.groupList, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( groupList ),
            } );
            console.log( await response.json() );
            // TODO: Add notification about deleting group(s)
        } catch ( error ) {
            console.log( error );
        }
    }
}