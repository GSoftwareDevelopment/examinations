import { App } from '../../../../app';

import { Modal } from 'gsd-minix/components';

import ModalTemplate from './_modal.hbs';

export class ListViewOptions extends Modal {
    constructor( _page ) {
        super( $( ModalTemplate() ), {}, _page );

        this.options = App.config.examinationsListView.current;
    }

    onShow () {
        this.setConf();
    }

    setConf () {
        for ( let keyConf in this.options ) {
            const elName = `setting_${keyConf}`;
            if ( this.elements[ elName ] )
                this.elements[ elName ].checked = this.options[ keyConf ];
        }
    }

    getConf () {
        const newOptions = {};
        for ( let keyConf in this.options ) {
            const elName = `setting_${keyConf}`;
            if ( this.elements[ elName ] )
                newOptions[ keyConf ] = this.elements[ elName ].checked;
        }
        return newOptions;
    }

    async onSubmit ( e ) {
        e.preventDefault();
        $( this.elements[ 'formSend' ] ).show();

        const newConfig = this.getConf();
        this.options = newConfig;

        if ( await App.config.examinationsListView.saveConfigData( newConfig ) ) {
            // TODO: show notification
        }
        $( this.elements[ 'formSend' ] ).hide();

        this.hideModal();
        this._page.refreshList();
    }
}