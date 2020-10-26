import { Modal } from "gsd-minix/components/modal";
import { SelectFetch } from "gsd-minix/components/select-fetch";

import ModalTemplate from './templates/modal.hbs';

import ValueEntryTemplate from './templates/value-item.hbs';

export class AddNewExamination extends Modal {
    constructor( _page ) {
        super( ModalTemplate(), _page );

        $( this.forms[ 'form' ] )
            .on( 'submit', ( e ) => { this.submit( e ); } );

        $( this.forms[ 'form' ] )
            .find( 'input[name="name"]' )
            .on( 'input', () => {
                $( this.forms[ 'form' ] )
                    .find( `#unique-feedback.custom-feedback` )
                    .hide();
            } )

        // initialize "general tab" events
        this.groupSelect = new SelectFetch(
            this.findElement( { findIn: this.forms[ 'form' ], selector: "#group" } ),
            {
                url: '/api/groups',
                HTMLSpinner: this.progress[ 'groupsFetching' ],
                dataMap: ( data ) => {
                    return data.map( ( { _id, name } ) => ( { value: _id, name } ) );
                }
            }
        );

        // "values tab"
        this.valuesList = $( this.dialog ).find( 'div#values-list' );

        // get template of entry for values list
        // this._tplNewValue = this.dialog.find( '#template-newValueEntry' ).detach();
    }

    onShow ( e ) {
        super.onShow();

        this.dialog
            .find( `.custom-feedback` )
            .hide();

        // change to default tab "General"
        this.dialog.find( 'a#tab-general' ).tab( 'show' );

        // delete all entrys in values list
        this.valuesList.find( 'div.item-value' ).detach();

        // add default entry to values list
        this.addValue( {
            type: 'numeric',
            name: 'Wartość',
            unit: '-',
            required: true,
        } );

        this.groupSelect.refresh();
    }

    async submit ( e ) {
        e.preventDefault();

        if ( this.forms[ 'form' ].checkValidity() === false ) {
            e.stopPropagation();
            this.forms[ 'form' ].classList.add( 'was-validated' );
            this.dialog.find( 'a#tab-general' ).tab( 'show' );
        } else {

            this.disableForm( 'form' );
            $( this.progress[ 'formSend' ] ).show();

            let fields = $( this.forms[ 'form' ] ).serialize();

            try {
                let response = await fetch( '/api/examinations', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: fields,
                } );
                const result = await response.json()
                console.log( result );
                if ( !result.error ) {
                    window.location = "/examinations";
                    return;
                } else {
                    if ( result.error.name == "ValidatorError" ) {
                        switch ( result.error.kind ) {
                            case "unique":
                                this.dialog.find( 'a#tab-general' ).tab( 'show' );
                                $( this.forms[ 'form' ] ).find( `[name='${result.error.path}'] ~ #unique-feedback.custom-feedback` )
                                    .show();
                                return
                            case "values":
                                this.dialog.find( 'a#tab-values' ).tab( 'show' );
                                $( this.forms[ 'form' ] ).find( '#values-feedback.custom-feedback' )
                                    .show();
                        }
                        this.enableForm( 'form' );
                        $( this.progress[ 'formSend' ] ).hide();
                    }
                }

            } catch ( error ) {
                console.log( error );
            }

        }
    }

    symbolize ( value ) {
        let def = `${value.required ? '!' : ''}${value.name} ${value.type} `;
        if ( value.unit ) def += '[' + value.unit + ']';
        if ( value.list ) def += '{' + value.list.split( ',' ).join( '|' ) + '}';
        return def;
    }

    addValue ( value ) {
        const newItem = $( ValueEntryTemplate( {
            valueDef: this.symbolize( value ),
            JSONValueDef: JSON.stringify( value )
        } ) );

        newItem.find( '#btn-deleteValue' ).on( 'click', ( e ) => {
            this.deleteValue( e );
        } )
        this.valuesList.append( newItem );

        $( this.forms[ 'form' ] ).find( '#values-feedback.custom-feedback' )
            .hide();
    }

    deleteValue ( e ) {
        $( e.currentTarget ).parent().parent().detach();
        let items = this.valuesList.find( '> div' );
        if ( items.length == 0 ) {
            $( this.forms[ 'form' ] ).find( '#values-feedback.custom-feedback' )
                .show();
        }
    }
}