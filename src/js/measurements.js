import { Pages } from './class/Pages';
import { Fetcher } from './class/Fetcher';
import { AddMeasurement } from './modals/measurements/addMeasurement';
import { FilterMeasurements } from './modals/measurements/filterMeasurements';

import listTemplate from './templates/measurementList.hbs';

export class Measurements extends Pages {
    constructor( _path ) {
        super( _path );

        this.modal = {
            AddMeasurement: new AddMeasurement( this ),
            FilterMeasurements: new FilterMeasurements(),
        };

        this.measurements = new Fetcher( "/measurements/?data", { method: "GET" } );

        // this.tplList = new TemplateFetch( {
        //     template: "_measurements._list",
        //     appendTo: $( 'div#measurements-results' )
        // } );

        this.getData();
    }

    getData () {
        this.measurements.getJSON()
            .then( ( data ) => {
                $( 'div#measurements-results' ).html( listTemplate( { lists: data } ) )
                // this.tplList.make( { lists: data } );
            } );
    }
}
// const measurements = new Measurements();