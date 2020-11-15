import apiRoutes from '../../../../api-routes';
import { Authorization } from '../../../../utils/authorization';

import { Modal, SelectFetch } from "gsd-minix/components";

import ModalTemplate from './_modal.hbs';
import ValueEntryTemplate from './templates/value-item.hbs';

export class AddNewExamination extends Modal {
    constructor( _page ) {
        super( $( ModalTemplate() ), {}, _page );

        $( this.elements.form )
            .find( 'input[name="name"]' )
            .on( 'input', () => {
                $( this.forms[ 'form' ] )
                    .find( `#unique-feedback.custom-feedback` )
                    .hide();
            } )

        // initialize "general tab" events
        this.groupSelect = new SelectFetch(
            $( this.elements[ 'group' ] ),
            {
                fetcherOpt: Authorization,
                url: apiRoutes.groupsList,
                HTMLSpinner: this.elements[ 'groupsFetching' ],
                dataMap: ( data ) => {
                    return data.map( ( { _id, name } ) => ( { value: _id, name } ) );
                }
            }
        );

        // "values tab"
        // this.values-list = $( this.HTMLComponent ).find( 'div#values-list' );
    }

    onShow ( e ) {
        super.onShow();

        this.HTMLComponent
            .find( `.custom-feedback` )
            .hide();

        // change to default tab "General"
        $( this.elements[ 'tab-general' ] ).tab( 'show' );

        // delete all entrys in values list
        $( this.elements[ 'values-list' ] )
            .find( 'div.item-value' )
            .detach();

        // add default entry to values list
        this.addValue( {
            type: 'numeric',
            name: 'Wartość',
            unit: '-',
            required: true,
        } );

        this.groupSelect.refresh();
    }

    async onSubmit ( e ) {
        e.preventDefault();

        if ( this.forms[ 'form' ].checkValidity() === false ) {
            e.stopPropagation();
            this.forms[ 'form' ].classList.add( 'was-validated' );
            $( this.elements[ 'tab-general' ] ).tab( 'show' );
        } else {

            this.disableForm( 'form' );
            $( this.elements[ 'formSend' ] ).show();

            let fields = $( this.forms[ 'form' ] ).serialize();

            try {
                let response = await fetch( apiRoutes.examinationList, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        ...Authorization.headers
                    },
                    body: fields,
                } );
                const result = await response.json()
                $( this.elements[ 'formSend' ] ).hide();
                if ( !result.error ) {
                    // window.location = "/examinations";
                    this._page.refreshList();
                    this.hideModal();
                    return;
                } else {
                    if ( result.error.name == "ValidatorError" ) {
                        switch ( result.error.kind ) {
                            case "unique":
                                $( this.elements[ 'tab-general' ] ).tab( 'show' );
                                $( this.forms[ 'form' ] ).find( `[name='${result.error.path}'] ~ #unique-feedback.custom-feedback` )
                                    .show();
                                return
                            case "values":
                                $( this.elements[ 'tab-values' ] ).tab( 'show' );
                                $( this.forms[ 'form' ] ).find( '#values-feedback.custom-feedback' )
                                    .show();
                        }
                        this.enableForm( 'form' );
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
        $( this.elements[ 'values-list' ] ).append( newItem );

        $( this.forms[ 'form' ] ).find( '#values-feedback.custom-feedback' )
            .hide();
    }

    deleteValue ( e ) {
        $( e.currentTarget ).parent().parent().detach();

        let items = $( this.elements[ 'values-list' ] ).find( '> div' );
        if ( items.length == 0 ) {
            $( this.forms[ 'form' ] ).find( '#values-feedback.custom-feedback' )
                .show();
        }
    }
}