/*
settings={
    template - template name
    appendTo - DOM element where compiled template has attacht
    data - object with data
}
*/
class TemplateFetch extends Fetcher {
    constructor( settings ) {
        super( `/template/${settings.template}`, { method: 'GET' } );

        this.appendTo = settings.appendTo;
    }

    make ( data ) {
        this.appendTo.empty();

        let data = this.getHTML()
            .then( ( template ) => {
                if ( template.error ) throw new Error( `Can't fetch template` );

                let template = Handlebars.compile( template );
                this.appendTo.html = template( data );
            } )
            .catch( ( err ) => {
                console.error( err );
                this.selectHTML.append( this.option[ 'error' ] );
            } )
            .finally( () => {
            } );
        return data;
    }
}