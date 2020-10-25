import './style.scss';

import { Pages } from 'gsd-minix/class-pages';

import { AddNewExamination } from './modals/newExamination';
import { CreateNewValue } from './modals/createNewValue';
import { CreateGroup } from './modals/createGroup';
import { ListViewOptions } from './modals/listViewOptions';

import { Fetcher } from 'gsd-minix/class-fetcher';
import { formatDate, formatTime } from '../../utils/misc';
import ExaminationsListTemplate from './templates/examinationsList.hbs';

export class Examinations extends Pages {
    constructor( _path ) {
        super( _path );

        this.modal = {
            listViewOptions: new ListViewOptions( this ),
            addNewExamination: new AddNewExamination( this ),
            createValue: new CreateNewValue( this ),
            createGroup: new CreateGroup( this )
        }

        this.form = $( '#form-list' ).on( 'submit', ( e ) => { e.preventDefault(); } );

        // $( 'button#btn-deleteEntry' ).on( 'click', ( e ) => { this.deleteEntry( e ); } )
        // $( 'button#btn-deleteGroup' ).on( 'click', ( e ) => { this.deleteGroup( e ); } )

        this.page.find( 'div#listOptionMenu > a' ).on( 'click', ( e ) => {
            this.listOptionsMenu( e );
        } );

        this.examinationBody = this.page.find( 'div#examinationTable' );

        this.examinations = new Fetcher( "/examinations/?data", { method: "GET" } );

        this.refreshList();
    }

    refreshList () {
        $( this.progress[ 'examinationFetch' ] ).show();
        this.examinationBody.empty();

        const conf = this.modal[ 'listViewOptions' ].options;

        this.examinations.getJSON()
            .then( ( data ) => {
                this.examinationBody.html( ExaminationsListTemplate( {
                    conf, lists: data.lists, groups: data.groups
                } ) );

                if ( conf[ 'fetch-latest' ] ) {

                    this.examinationBody.find( `div.row-item` ).each( ( index, el ) => {
                        const id = $( el ).data( 'item' );
                        const html = $( el ).find( 'div.latest-date' );

                        let latestFetch = new Fetcher( `/measurements/latest?examinationId=${id}`, { method: 'GET' } );
                        latestFetch.getJSON()
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
            } )
            .finally( () => {
                $( this.progress[ 'examinationFetch' ] ).hide();
            } );
    }

    listOptionsMenu ( e ) {
        let optionID = e.currentTarget.id;
        switch ( optionID ) {
            case "listOption-refresh": this.refreshList(); break;
            case "listOption-deleteSelected": this.deleteSelected( e ); break;
        }
    }

    deleteEntry ( e ) {
        const el = $( e.currentTarget ).parents( 'tr' );
        const entryID = el.data( 'item' );

        el.detach();

        this.fetchDeleteEntry( [ entryID ] );
    }

    deleteSelected ( e ) {
        const selected = this.form.find( 'input[type="checkbox"]:checked' );
        const ids = selected.map( ( i, el ) => {
            let id = $( el ).parents( 'div.row' ).data( 'item' );
            return id;
        } ).get();

        if ( !ids.length ) {
            // TODO: zmień to na referencje (this.modal[...]) związaną ze stroną.
            $( '#modal-noSelection' ).modal( 'show' );
            return;
        }

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

    async fetchDeleteEntry ( itemsList ) {
        try {
            let response = await fetch( '/examinations', {
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

        $( '#modal-confirmGroupDelete' ).modal( 'show' );

        $( 'button#btn-confirmGroupDelete' ).off().on( 'click', ( e ) => {
            this.form.find( `tr` ).each( ( i, el ) => {
                const id = $( el ).data( 'group' );
                if ( id === groupID ) $( el ).detach();
            } );

            this.fetchDeleteGroup( [ groupID ] );
        } )

    }

    async fetchDeleteGroup ( groupList ) {
        try {
            let response = await fetch( '/groups', {
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