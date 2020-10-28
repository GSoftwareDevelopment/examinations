import './style.scss';
import apiRoutes from '../../api-routes';

import { Pages } from 'gsd-minix/class-pages';
import { Fetcher } from 'gsd-minix/class-fetcher';

import { Paginator } from 'gsd-minix/components';

import { AddMeasurement } from './modals/addMeasurement';
import { FilterMeasurements } from './modals/filterMeasurement';

import listTemplate from './templates/measurementList.hbs';

export class Measurements extends Pages {
    constructor( _path ) {
        super( _path );

        this.modal = {
            AddMeasurement: new AddMeasurement( this ),
            FilterMeasurements: new FilterMeasurements( this ),
        };

        this.results = this.body.find( 'div#measurements-results' );
        this.paginator = new Paginator( this.body.find( 'div#paginator' ), {
            limit: 10,
            page: 0,
            totalPages: 0,
            onChange: ( e ) => {
                this.getData();
            }
        } );

        this.measurements = new Fetcher( apiRoutes.measurementList, { method: "GET" } );

        this.getData();
    }

    getData () {
        $( this.elements[ 'measurements-fetch' ] ).show();
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

                $( this.elements[ 'measurements-fetch' ] ).hide();
            } );
    }
}