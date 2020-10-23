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

    loadConfigData () {
        this.optionsFetch.getJSON()
            .then( ( userConfig ) => {
                if ( userConfig.error ) throw new Error( `Can't get configuration!`, error )
                this.options = { ...this.options, ...userConfig.data };
            } );
    }

    saveConfigData () {
        const newUserConfig = this.getConf();
        console.log( newUserConfig );

        this.optionsFetch.getJSON( { method: 'POST', body: JSON.stringify( newUserConfig ) } )
            .then( ( data ) => {
                if ( data.error ) throw new Error( `Can't save configuration!`, error )
                // TODO: show notification

                this.dialog.modal( 'hide' );
                this._page.refreshList();
            } )
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

    submit ( e ) {
        e.preventDefault();
        this.saveConfigData();
    }
}