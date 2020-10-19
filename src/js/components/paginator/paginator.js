import PaginationTemplate from './pagination.hbs';

export default class Paginator {
    constructor( HTMLElement, opt ) {
        this.HTMLComponent = HTMLElement;
        this.limit = 10;
        this.currentPage = 0;
        this.totalPages = 0;

        this.onPageChange = null;
        this.onLimitChange = null;

        this.refresh();
    }

    refresh () {
        this.HTMLComponent.html( PaginationTemplate( {
            limit: this.limit,
            currentPage: this.currentPage,
            totalPages: this.totalPages,
        } ) );

        $( this.HTMLComponent ).find( 'a#page-changer' ).one( 'click', ( e ) => {
            const page = $( e.currentTarget ).data( 'page' );
            this.currentPage = page;

            if ( this.onPageChange ) this.onPageChange( e );
        } );
        $( this.HTMLComponent ).find( 'a#limit-changer' ).one( 'click', ( e ) => {
            const newLimit = parseInt( $( e.currentTarget ).data( 'limit' ) );
            this.limit = newLimit;

            if ( this.onLimitChange ) this.onLimitChange( e );
        } );
    }
}
