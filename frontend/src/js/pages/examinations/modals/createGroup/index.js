import apiRoutes from '../../../../api-routes';

import { Modal } from "gsd-minix/components";

import ModalTemplate from "./_modal.hbs";

class CreateGroup extends Modal {
    constructor( _page ) {
        super( $( ModalTemplate() ), {}, _page );

        $( this.forms[ 'createGroup' ] ).find( 'input[name="name"]' )
            .on( 'input', () => {
                $( this.forms[ 'createGroup' ] ).find( `[name='name'] ~ .unique-feedback` )
                    .hide();
            } )
    }

    async onSubmit ( e ) {
        e.preventDefault();

        if ( this.forms[ 'createGroup' ].checkValidity() === false ) {
            e.stopPropagation();
            this.forms[ 'createGroup' ].classList.add( 'was-validated' );
        } else {
            this.disableForm( 'createGroup' );
            $( this.elements[ 'formSend' ] ).show();

            let fields = $( this.forms[ 'createGroup' ] ).serialize();
            try {

                let response = await fetch( apiRoutes.groupsList, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: fields,
                } );
                const result = await response.json()

                $( this.elements[ 'formSend' ] ).hide();

                if ( !result.error ) {
                    this._page.refreshList();
                    this._page.modal.addNewExamination.groupSelect.refresh();
                    this.hideModal();
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
            } catch ( error ) {
                console.log( error );
            }

        }
    }
}

export { CreateGroup }