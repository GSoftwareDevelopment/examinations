import { Pages } from './class/Pages';
import { AddNewExamination } from "./modals/examinations/addNewExamination";
import { CreateNewValue } from "./modals/examinations/createNewValue";
import { CreateGroup } from "./modals/examinations/createGroup";

export class Examinations extends Pages {
    constructor( _path ) {
        super( _path );

        this.modal = {
            addNewExamination: new AddNewExamination(),
            createValue: new CreateNewValue( this ),
            createGroup: new CreateGroup()
        }

        this.form = $( '#form-list' ).on( 'submit', ( e ) => { e.preventDefault(); } );
        $( '#btn-deleteSelection' ).on( 'click', ( e ) => { this.deleteSelection( e ) } );
        $( 'button#btn-deleteEntry' ).on( 'click', ( e ) => { this.deleteEntry( e ); } )
        $( 'button#btn-deleteGroup' ).on( 'click', ( e ) => { this.deleteGroup( e ); } )

        // #btn-editEntry
        // #btn-editGroup

        // Mousetrap.bind( 'ins', () => {
        //     $( 'button#btn-add' ).trigger( 'click' );
        // } );

        // this.examinations = new Fetcher( "/examinations/?data", { method: "GET" } );

        // this.tplList = new TemplateFetch( {
        //     template: "_examinations._list",
        //     appendTo: $( 'div#examintions-list' )
        // } );

    }

    // getData () {
    //     this.examinations.getJSON()
    //         .then( ( data ) => {
    //             this.tplList.make( { lists: data } );
    //         } );
    // }

    deleteEntry ( e ) {
        const el = $( e.currentTarget ).parents( 'tr' );
        const entryID = el.data( 'item' );

        el.detach();

        this.fetchDeleteEntry( [ entryID ] );
    }

    deleteSelection ( e ) {
        e.preventDefault();

        const selected = this.form.find( 'input[type="checkbox"]:checked' );
        const ids = selected.map( ( i, el ) => {
            let id = $( el ).parents( 'tr' ).data( 'item' );
            return id;
        } ).get();

        if ( !ids.length ) {
            $( '#modal-noSelection' ).modal( 'show' );
            return;
        }

        selected
            .each( ( i, el ) => {
                $( el ).parents( 'tr' ).detach()
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
            console.log( await response.json() );
            // TODO: Add notification about deleting entry(s)
        } catch ( error ) {
            console.log( error );
        }
    }

    // Groups

    deleteGroup ( e ) {
        const el = $( e.currentTarget ).parents( 'tr' );
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

// var examinations = new Examinations( '/examinations' );

