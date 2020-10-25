/**
 * Paginator component
 * @module Components/Paginator
 */

import './style.scss';
import Component from '../../minix/Component';
import PaginationTemplate from './pagination.hbs';

/**
 * Paginator component Class
 */
export default class Paginator extends Component {

    /**
     * Initial parameters for Paginator component
     * @typedef {object} PaginatorOptions
     * @property {number} limit - Results limit on the page
     * @property {number} page - Current page number
     * @property {number} totalPages - Total pages
     * @property {function} onChange - Callback for any change in component
     * @property {function} onPageChange - Callback for page change
     * @property {function} onLimitChange - Callback for limit change
     */

    /**
     * Create new Paginator component
     * @param {HTMLElement} HTMLElement - DOM Element
     * @param {PaginatorOptions} opt - initial parameters for Paginator
     */
    constructor( HTMLElement, opt ) {
        super();

        /** 
         * @property {jQuery<HTMLElement>} HTMLComponent - DOM Element Wrapper
         */
        this.HTMLComponent = HTMLElement;

        /**
         * @property {number} limit - Results limit on the page
         */
        this.limit = ( opt && opt.limit ) ? opt.limit : 0;

        /** 
         * @property {number} currentPage - Current page number
         */
        this.currentPage = ( opt && opt.page ) ? opt.page : 0;

        /**
         * @property {number} totalPages - Total pages 
         */
        this.totalPages = ( opt && opt.totalPages ) ? opt.totalPages : 0;


        /** 
         * @property {function} onChange - Callback for any change in component 
         */
        this.onChange = ( opt && opt.onChange ) ? opt.onChange : null;
        /** 
         * @property {function} onPageChange - Callback for page change 
         */
        this.onPageChange = ( opt && opt.onPageChange ) ? opt.onPageChange : null;
        /** 
         * @property {function} onLimitChange - Callback for limit change 
         */
        this.onLimitChange = ( opt && opt.onLimitChange ) ? opt.onLimitChange : null;

        this.refresh();
    }

    /**
     * Refresh component
     */
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
            if ( this.onChange ) this.onChange( e );
        } );

        $( this.HTMLComponent ).find( 'a#limit-changer' ).one( 'click', ( e ) => {
            const newLimit = parseInt( $( e.currentTarget ).data( 'limit' ) );
            this.limit = newLimit;

            if ( this.onLimitChange ) this.onLimitChange( e );
            if ( this.onChange ) this.onChange( e );
        } );
    }
}
