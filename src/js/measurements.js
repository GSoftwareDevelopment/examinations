import { Pages } from './class/Pages';
import { Fetcher } from './class/Fetcher';
import { AddMeasurement } from './modals/measurements/addMeasurement';
import { FilterMeasurements } from './modals/measurements/filterMeasurements';

import listTemplate from '../templates/measurementList.hbs';
import Paginator from './components/paginator/paginator';

export class Measurements extends Pages {
    constructor( _path ) {
        super( _path );

        this.modal = {
            AddMeasurement: new AddMeasurement( this ),
            FilterMeasurements: new FilterMeasurements(),
        };

        this.results = this.page.find( 'div#measurements-results' );
        this.paginator = new Paginator( this.page.find( 'div#paginator' ), {
            limit: 10,
            page: 0,
            totalPages: 0,
        } );
        this.paginator.onPageChange =
            this.paginator.onLimitChange = ( e ) => {
                this.getData();
            };

        this.measurements = new Fetcher( "/measurements", { method: "GET" } );

        this.getData();
    }

    getData () {
        $( this.progress[ 'resultsFetch' ] ).show();
        this.results.empty();

        this.measurements.getJSON( {
            queryParams: {
                data: true,
                limit: this.paginator.limit,
                page: this.paginator.currentPage,
            }
        } )
            .then( ( data ) => {
                this.results.html( listTemplate( { lists: data.measurements } ) );
                this.paginator.totalPages = ( this.paginator.limit > 0 ) ? Math.ceil( data.totalResults / this.paginator.limit ) - 1 : 0
                this.paginator.refresh();

                $( this.progress[ 'resultsFetch' ] ).hide();
            } );
    }
}