import { Pages } from './class/Pages';
import { Fetcher } from './class/Fetcher';
import { AddMeasurement } from './modals/measurements/addMeasurement';
import { FilterMeasurements } from './modals/measurements/filterMeasurements';

import listTemplate from '../templates/measurementList.hbs';
import Pagination from '../templates/pagination.hbs';

export class Measurements extends Pages {
    constructor( _path ) {
        super( _path );

        this.modal = {
            AddMeasurement: new AddMeasurement( this ),
            FilterMeasurements: new FilterMeasurements(),
        };

        this.results = this.page.find( 'div#measurements-results' );
        this.pagination = this.page.find( 'div#pagination' );

        this.measurements = new Fetcher( "/measurements/?data", { method: "GET" } );

        this.getData();
    }

    getData () {
        $( this.progress[ 'resultsFetch' ] ).show();

        this.measurements.getJSON()
            .then( ( data ) => {
                this.results.html( listTemplate( { lists: data } ) );
                this.pagination.html( Pagination() );

                $( this.progress[ 'resultsFetch' ] ).hide();
            } );
    }
}