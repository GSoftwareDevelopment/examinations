class SelectFetch extends Fetcher {
    constructor( settings ) {
        super( settings.url, { method: 'GET' } );

        this.selectHTML = settings.select;
        this.spinner = settings.spinner || null;

        this.option = {};
        this.option[ 'emptyList' ] = this.selectHTML.find( 'option[data-type="emptyList"]' ).detach();
        this.option[ 'prompt' ] = this.selectHTML.find( 'option[data-type="prompt"]' ).detach();
        this.option[ 'error' ] = this.selectHTML.find( 'option[data-type="error"]' ).detach();
    }

    getData () {
        if ( this.spinner )
            $( this.spinner ).show();

        this.selectHTML.find( 'option' ).detach();

        let data = this.getJSON()
            .then( ( data ) => {
                if ( data.error ) throw new Error( `Can't fetch data` );

                if ( data.length == 0 ) {
                    this.selectHTML.append( this.option[ 'emptyList' ] );
                    return;
                }

                this.selectHTML.append( this.option[ 'prompt' ] );
                return data;
            } )
            .catch( ( err ) => {
                console.error( err );
                this.selectHTML.append( this.option[ 'error' ] );
            } )
            .finally( () => {
                if ( this.spinner )
                    $( this.spinner ).hide();
            } );
        return data;
    }
}