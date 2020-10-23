/**
 * Pages class
 * @module class/Pages
 */
export class Pages {
    /**
     * Init page component
     * @param {string} path - Page route path
     */
    constructor( path ) {
        /**
         * @property {JQuery<HTMLElement>} - DOM element access point
         */
        this.page = $( `main[role='main']` );

        /**
         * @property {string} path - Page route path
         */
        this.path = path;

        /**
         * @property {Array} modal - Dialogs array
         */
        this.modal = {};

        let _progress = $( this.page ).find( '[role="progressbar"], [role="status"]' ).get();

        /**
         * @property {Array} progress - All progressbars & spinner
         */
        this.progress = new Array();

        for ( let el of _progress ) {
            this.progress[ el.id ] = el;
            $( el ).hide();
        }

    }
}