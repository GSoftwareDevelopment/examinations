import withQuery from 'with-query';

class Fetcher {
    constructor( url, options ) {
        this.url = url;
        this.options = options;
    }

    async getJSON ( extraOptions ) {
        let query = {};

        if ( extraOptions && extraOptions.queryParams ) {
            query = extraOptions.queryParams;
            delete extraOptions.queryParams;
        }

        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            ...this.options,
            ...extraOptions
        }

        try {
            const response = await fetch( withQuery( this.url, query ), options );

            if ( !response.ok ) {
                const message = `An error has occured: ${response.status}`;
                throw new Error( message );
            }

            const data = await response.json();
            return data;
        } catch ( error ) {
            console.error( error );
            return { error }
        }
    }

    async getHTML () {
        this.options = {
            headers: {
                'Content-Type': 'text/html'
            },
            ...this.options
        }

        try {
            const response = await fetch( this.url, this.options );

            if ( !response.ok ) {
                const message = `An error has occured: ${response.status}`;
                throw new Error( message );
            }

            const data = await response.text();
            return data;
        } catch ( error ) {
            console.error( error );
            return { error }
        }
    }
}

export { Fetcher }
