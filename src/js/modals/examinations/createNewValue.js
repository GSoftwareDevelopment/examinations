import { Dialog } from "../../components/dialog/Dialog";

class CreateNewValue extends Dialog {
    constructor( _page ) {
        super( 'addValue' );

        this._page = _page;

        $( this.forms[ 'form-addValue' ] )
            .on( 'submit', ( e ) => { this.submit( e ); } );

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

    showDialog ( e ) {
        super.showDialog( e );
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

    async submit ( e ) {
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
            this.dialog.modal( 'hide' );
        }
    }
}

export { CreateNewValue }