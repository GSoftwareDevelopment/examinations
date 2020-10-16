// import $ from "jquery";
import { Fetcher } from "./Fetcher";

/*
settings={
    template - template name
    appendTo - DOM element where compiled template will be attached
    data - object with data
}
*/
class TemplateFetch extends Fetcher {
    constructor( settings ) {
        super( `/template/${settings.template}`, { method: 'GET' } );

        this.appendTo = settings.appendTo;
        this.spinner = this.appendTo.find( `div[data-status="fetchData"]` ).detach();
    }

    make ( templateData ) {
        this.appendTo.empty();
        this.appendTo.append( this.spinner );

        let request = this.getHTML()
            .then( ( templateSoure ) => {
                if ( templateSoure.error ) throw new Error( `Can't fetch template` );

                let template = Handlebars.compile( templateSoure );
                this.appendTo.html( template( templateData ) );
            } )
            .catch( ( err ) => {
                console.error( err );

                // this.selectHTML.append( this.option[ 'error' ] );
            } )
            .finally( () => {
            } );
        return request;
    }
}

export { TemplateFetch }