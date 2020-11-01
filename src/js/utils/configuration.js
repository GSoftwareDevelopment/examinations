import { Fetcher } from 'gsd-minix/class-fetcher';

export class Configuration {
    constructor( resourceName, defaults ) {
        this.resourceName = resourceName;
        this.defaults = defaults;
        this.current = {}

        this.configFetch = new Fetcher( resourceName, { method: 'GET' } );

        return ( async () => {
            await this.loadConfigData();
            return this;
        } )();
    }

    async loadConfigData () {
        console.log( `Loading config ${this.configFetch.url}...` );
        try {
            const loadedConfig = await this.configFetch.getJSON()
            if ( loadedConfig.error )
                throw new Error( `Can't get configuration!` );

            if ( !loadedConfig[ 'OK' ] ) {
                console.log( 'Configuration is not defined. Using defaults.' );
                this.current = { ...this.defaults }
                return;
            }

            console.log( 'Using stored configuration: ', loadedConfig.data );
            if ( loadedConfig.data )
                this.current = loadedConfig.data;
        } catch ( error ) {
            console.log( error );
        }
    }

    async saveConfigData ( newConfig ) {
        console.log( `Storing config...`, newConfig );
        this.current = { ...newConfig };

        try {
            const data = await this.configFetch.getJSON( { method: 'POST', body: JSON.stringify( newConfig ) } )
            if ( data.error ) throw new Error( `Can't save configuration!` );
            return true;
        } catch ( error ) {
            console.log( error );
            return false;
        }
    }
}