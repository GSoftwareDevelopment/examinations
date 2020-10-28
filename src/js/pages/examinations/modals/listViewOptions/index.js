import { Modal } from 'gsd-minix/components/modal';
import { App } from '../../../../app';

import ModalTemplate from './template/_viewOptions.hbs';

export class ListViewOptions extends Modal {
    constructor( _page ) {
        super( ModalTemplate(), _page );

        $( this.forms[ 'form-options' ] ).on( 'submit', ( e ) => { this.submit( e ); } );
        this.options = App.config.examinationsListView.current;

        this._HTMLOptions = {}
        for ( let keyOption in this.options ) {
            this._HTMLOptions[ keyOption ] = this.findElement( {
                findIn: this.dialog,
                selector: `input#setting_${keyOption}`
            } );
        }
    }

    onShow () {
        this.setConf();
    }

    setConf () {
        for ( let keyConf in this.options ) {
            this._HTMLOptions[ keyConf ][ 0 ].checked = this.options[ keyConf ];
        }
    }

    getConf () {
        const newOptions = {};
        for ( let keyConf in this.options ) {
            newOptions[ keyConf ] = this._HTMLOptions[ keyConf ][ 0 ].checked;
        }
        return newOptions;
    }

    async submit ( e ) {
        e.preventDefault();
        $( this.progress[ 'formSend' ] ).show();

        const newConfig = this.getConf();
        this.options = newConfig;

        if ( await App.config.examinationsListView.saveConfigData( newConfig ) ) {
            // TODO: show notification
        }
        $( this.progress[ 'formSend' ] ).hide();

        this.dialog.modal( 'hide' );
        this._page.refreshList();
    }
}