class Dialog {
    constructor( id ) {
        this.dialog = $( `div#${id}.modal` );
        let _forms = $( this.dialog ).find( 'form' ).get();
        this.forms = new Array();

        for ( let el of _forms ) {
            this.forms[ el.id ] = el;
            this.clearFormValidation( el.id );
        }

        let _progress = $( this.dialog ).find( '[role="progressbar"], [role="status"]' ).get();
        this.progress = new Array();

        for ( let el of _progress ) {
            this.progress[ el.id ] = el;
            $( el ).hide();
        }

        this.dialog.on( 'show.bs.modal', ( e ) => { this.showDialog() } );
    }

    showDialog () {
        this.resetAllForms();
        this.autoFocus();
        for ( let key in this.progress ) {
            $( this.progress[ key ] ).hide();
        }
    }

    autoFocus () {
        this.dialog.one( 'shown.bs.modal', () => {
            this.dialog
                .find( '*[autofocus]' )
                .first()
                .trigger( 'focus' );
        } );
    }

    clearFormValidation ( formID ) {
        if ( formID ) {
            let form = this.forms[ formID ];
            $( form )
                .removeClass( 'was-validated' );
            $( form )
                .find( `.unique-feedback` )
                .hide();
        }
    }

    enableForm ( formID ) {
        let form = this.forms[ formID ];

        $( form )
            .find( 'button[type="submit"], input, select, textarea' )
            .removeClass( 'disabled' );
    }

    disableForm ( formID ) {
        let form = this.forms[ formID ];

        $( form )
            .find( 'button[type="submit"], input, select, textarea' )
            .addClass( 'disabled' );
    }

    resetForm ( formID ) {
        this.forms[ formID ].reset();
        this.clearFormValidation( formID );
        this.enableForm( formID );
    }

    resetAllForms () {
        for ( let form in this.forms )
            this.resetForm( form );
    }
}