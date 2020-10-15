class AddNewGroup extends Dialog {
    constructor() {
        super( 'add-group' );

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
                    window.location = "/examinations";
                    return;
                } else {
                    console.log( result.error );
                    if ( result.error.name == "ValidatorError" ) {
                        switch ( result.error.kind ) {
                            case "unique":
                                $( this.forms[ 'createGroup' ] ).find( `[name='${result.error.path}'] ~ .unique-feedback` )
                                    .show();
                                this.enableForm( 'createGroup' );
                                return
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

let modal_AddNewGroup = new AddNewGroup();