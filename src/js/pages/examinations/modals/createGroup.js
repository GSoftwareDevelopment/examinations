import { Dialog } from "../../../lib/components/dialog";

class CreateGroup extends Dialog {
    constructor( _page ) {
        super( 'add-group', _page );

        $( this.forms[ 'createGroup' ] ).on( 'submit', ( e ) => { this.submit( e ); } );

        $( this.forms[ 'createGroup' ] ).find( 'input[name="name"]' )
            .on( 'input', () => {
                $( this.forms[ 'createGroup' ] ).find( `[name='name'] ~ .unique-feedback` )
                    .hide();
            } )
    }

    async submit ( e ) {
        e.preventDefault();
        if ( this.forms[ 'createGroup' ].checkValidity() === false ) {
            e.stopPropagation();
            this.forms[ 'createGroup' ].classList.add( 'was-validated' );
        } else {

            this.disableForm( 'createGroup' );
            $( this.progress[ 'formSend' ] ).show();

            let fields = $( this.forms[ 'createGroup' ] ).serialize();

            try {

                let response = await fetch( '/groups', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: fields,
                } );
                const result = await response.json()
                if ( !result.error ) {
                    // window.location = "/examinations";

                    this._page.modal.addNewExamination.groupSelect.refresh();
                    this.dialog.modal( 'hide' );
                    return;
                } else {
                    if ( result.error.name == "ValidatorError" ) {
                        switch ( result.error.kind ) {
                            case "unique":
                                $( this.forms[ 'createGroup' ] ).find( `[name='${result.error.path}'] ~ .unique-feedback` )
                                    .show();
                                this.enableForm( 'createGroup' );
                                break;
                        }
                    }
                }
                $( this.progress[ 'formSend' ] ).hide();
            } catch ( error ) {
                console.log( error );
            }

        }
    }
}

export { CreateGroup }