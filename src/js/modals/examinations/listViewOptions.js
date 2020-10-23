import { Dialog } from '../../components/dialog';

import { Fetcher } from '../../class/Fetcher';

export class ListViewOptions extends Dialog {
    constructor( _page ) {
        super( 'view-options', _page );

        $( this.forms[ 'form-options' ] ).on( 'submit', ( e ) => { this.submit( e ); } );

        this.optionsFetch = new Fetcher( '/examinations/configuration', { method: 'GET' } );
        this.options = {
            'list-pagination': false,
            'fetch-latest': true,
            'group-view': true,
            'group-description': true,
            'examination-description': true,
        };

        this._HTMLOptions = {}

        for ( let keyOption in this.options ) {
            this._HTMLOptions[ keyOption ] = this.findElement( {
                findIn: this.dialog,
                selector: `input#setting_${keyOption}`
            } );
        }

        this.loadConfigData();
    }

    onShowDialog () {
        this.setConf();
    }

    async loadConfigData () {
        console.log( `Loading list view config...` );
        try {
            const userConfig = await this.optionsFetch.getJSON()
            if ( userConfig.error )
                throw new Error( `Can't get configuration!`, userConfig.error );

            if ( !userConfig[ 'OK' ] ) {
                console.log( 'Configuration is not defined. Using defaults.' );
                return;
            }

            console.log( 'Using stored configuration: ', userConfig );
            if ( userConfig.data )
                this.options = userConfig.data;
        } catch ( error ) {
            console.log( error );
        }
    }

    async saveConfigData () {
        console.log( 'Storing config...' );
        const newUserConfig = this.getConf();

        try {
            const data = await this.optionsFetch.getJSON( { method: 'POST', body: JSON.stringify( newUserConfig ) } )
            if ( data.error ) throw new Error( `Can't save configuration!`, error )
            return true;
        } catch ( error ) {
            console.log( error );
            return false;
        }
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
        if ( await this.saveConfigData() ) {
            // TODO: show notification
        }
        $( this.progress[ 'formSend' ] ).hide();

        this.dialog.modal( 'hide' );
        this._page.refreshList();
    }
}