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

        this.measurements = new Fetcher( "/measurements", { method: "GET" } );

        this.paginator = {
            limit: 50,
            page: 0
        };

        this.getData();
    }

    getData () {
        $( this.progress[ 'resultsFetch' ] ).show();

        this.measurements.getJSON( { queryParams: { data: true, ...this.paginator } } )
            .then( ( data ) => {
                this.results.html( listTemplate( { lists: data.measurements } ) );
                this.pagination.html( Pagination( {
                    currentPage: this.paginator.page,
                    totalPages: ( this.paginator.limit > 0 ) ? Math.ceil( data.totalResults / this.paginator.limit ) - 1 : 0,
                } ) );

                this.page.find( 'a#page-changer' ).one( 'click', ( e ) => {
                    const page = $( e.currentTarget ).data( 'page' );
                    this.paginator.page = page;
                    this.getData();
                } )
                $( this.progress[ 'resultsFetch' ] ).hide();
            } );
    }
}