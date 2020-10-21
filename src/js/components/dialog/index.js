import Component from '../../class/Component';

/**
 * Dialog class component
 * @module component/Dialog
 * @exports Dialog
 */
export class Dialog extends Component {
    /**
     * Init Dialog component
     * @param {string} id - Bootstrap modal component identificator
     */
    constructor( id ) {
        super();
        /**
         * @property {JQuery<HTMLElement>} dialog - DOM Element
         */
        this.dialog = $( `div#${id}.modal` );
        let _forms = $( this.dialog ).find( 'form' ).get();

        /**
         * @property {Array} forms - All forms in dialog
         */
        this.forms = new Array();

        for ( let el of _forms ) {
            this.forms[ el.id ] = el;
            this.clearFormValidation( el.id );
        }

        let _progress = $( this.dialog ).find( '[role="progressbar"], [role="status"]' ).get();

        /**
         * @property {Array} progress - All progressbars & spinners in dialog
         */
        this.progress = new Array();

        for ( let el of _progress ) {
            this.progress[ el.id ] = el;
            $( el ).hide();
        }

        this.dialog.on( 'show.bs.modal', ( e ) => { this.showDialog() } );
    }

    /**
     * Method fired when dialog is show
     */
    showDialog () {
        this.resetAllForms();
        this.autoFocus();
        for ( let key in this.progress ) {
            $( this.progress[ key ] ).hide();
        }
    }

    /**
     * Method for default autofocus dialog element
     */
    autoFocus () {
        this.dialog.one( 'shown.bs.modal', () => {
            this.dialog
                .find( '*[autofocus]' )
                .first()
                .trigger( 'focus' );
        } );
    }

    /**
     * Clear form validation
     * @param {string} formID - Form identificator
     */
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

    /**
     * Enable form elements
     * @param {string} formID - Form identificator
     */
    enableForm ( formID ) {
        let form = this.forms[ formID ];

        $( form )
            .find( 'button[type="submit"], input, select, textarea' )
            .removeClass( 'disabled' );
    }

    /**
     * Disable form elements
     * @param {string} formID - Form identificator
     */
    disableForm ( formID ) {
        let form = this.forms[ formID ];

        $( form )
            .find( 'button[type="submit"], input, select, textarea' )
            .addClass( 'disabled' );
    }

    /**
     * Reset form elements
     * @param {string} formID  - Form identificator
     */
    resetForm ( formID ) {
        this.forms[ formID ].reset();
        this.clearFormValidation( formID );
        this.enableForm( formID );
    }

    /**
     * Reset all forms
     * @param {string} formID  - Form identificator
     */
    resetAllForms () {
        for ( let form in this.forms )
            this.resetForm( form );
    }
}