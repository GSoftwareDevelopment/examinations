import { Modal } from "gsd-minix/components";

import ModalTemplate from './_modal.hbs';

class CreateNewValue extends Modal {
    constructor( _page ) {
        super( $( ModalTemplate() ), {}, _page );

        $( this.forms[ 'form-addValue' ] )
            .find( '#type' )
            .on( 'change', ( e ) => {
                const v = e.currentTarget.value;
                const f = $( this.forms[ 'form-addValue' ] )
                    .find( `option[value="${v}"]` )
                    .data( 'fields' );
                this.setVisibleFields( f );
            } );
    }

    onShow ( e ) {
        super.onShow( e );
        this.setVisibleFields( 'unit' );
    }

    setVisibleFields ( fields ) {
        $( this.forms[ 'form-addValue' ] )
            .find( '.var-field' ).addClass( 'd-none' );
        $( this.forms[ 'form-addValue' ] )
            .find( '.var-field > input' ).removeAttr( 'required' );;
        fields.split( ' ' ).forEach( ( field ) => {
            $( this.forms[ 'form-addValue' ] )
                .find( `div#field-${field}` ).removeClass( 'd-none' );
            $( this.forms[ 'form-addValue' ] )
                .find( `div#field-${field} > input` )
                .attr( 'required', true )
                .val( '' );
        } );
    }

    async onSubmit ( e ) {
        e.preventDefault();
        if ( this.forms[ 'form-addValue' ].checkValidity() === false ) {
            e.stopPropagation();
            this.forms[ 'form-addValue' ].classList.add( 'was-validated' );
        } else {

            this.disableForm( 'form-addValue' );

            const fields = $( this.forms[ 'form-addValue' ] );
            const newValue = {
                type: fields.find( '#type' ).val(),
                name: fields.find( '#name' ).val(),
                unit: fields.find( '#unit' ).val(),
                list: fields.find( '#list' ).val()
                    .split( ',' )
                    .map( ( el ) => {
                        el = el.trim();
                        if ( el ) return el;
                    } )
                    .join( ',' ),
                required: fields.find( '#required' ).prop( 'checked' ),
            }

            this._page.modal.addNewExamination.addValue( newValue );
            this.hideModal();
            // this.HTMlComponent.modal( 'hide' );
        }
    }
}

export { CreateNewValue }