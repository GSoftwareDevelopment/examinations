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
        this.paginator = this.page.find( 'div#paginator' );

        this.paginatorOpt = {
            limit: 10,
            page: 0
        };

        this.measurements = new Fetcher( "/measurements", { method: "GET" } );

        this.getData();
    }

    getData () {
        $( this.progress[ 'resultsFetch' ] ).show();
        this.results.empty();
        this.paginator.find( 'a#page-changer' ).off( 'click' );

        this.measurements.getJSON( { queryParams: { data: true, ...this.paginatorOpt } } )
            .then( ( data ) => {
                this.results.html( listTemplate( { lists: data.measurements } ) );
                this.paginator.html( Pagination( {
                    limit: this.paginatorOpt.limit,
                    currentPage: this.paginatorOpt.page,
                    totalPages: ( this.paginatorOpt.limit > 0 ) ? Math.ceil( data.totalResults / this.paginatorOpt.limit ) - 1 : 0,
                } ) );

                this.paginator.find( 'a#page-changer' ).one( 'click', ( e ) => {
                    const page = $( e.currentTarget ).data( 'page' );
                    this.paginatorOpt.page = page;
                    this.getData();
                } );
                this.paginator.find( 'a#limit-changer' ).one( 'click', ( e ) => {
                    const newLimit = parseInt( $( e.currentTarget ).data( 'limit' ) );
                    this.paginatorOpt.limit = newLimit;
                    this.getData();
                } );

                $( this.progress[ 'resultsFetch' ] ).hide();
            } );
    }
}