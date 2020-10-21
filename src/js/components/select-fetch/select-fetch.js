import Component from '../../class/Component';
import { Fetcher } from '../../class/Fetcher';

/**
 * Select element extended with fetch function
 * @module component/SelectFetch
 */

export class SelectFetch extends Component {
    /**
     * Initial parameters for SelectFetch
     * @typedef {Object} SelectFetchOption
     * @property {string} url
     * @property {HTMLObject} HTMLSpinner
     * @property {function} dataMap
     * @property {boolean} autoInit
     * @property {function} onChange
     */

    /**
     * Init component
     * @param {HTMLElement} HTMLElement - A DOM element pointing to a Select element
     * @param {...SelectFetchOption} [opt] - Component options {@link SelectFetchOption}
     */
    constructor( HTMLElement, opt ) {
        super();

        /**
         * @property {HTMLElement} HTMLComponent
         */
        this.HTMLComponent = HTMLElement;

        /**
         * @property {string} url
         */
        this.url = ( opt && opt.url ) ? opt.url : '';

        /**
         * @property {HTMLElement} HTMLSpinner
         */
        this.HTMLSpinner = ( opt && opt.HTMLSpinner ) ? opt.HTMLSpinner : null;

        /**
         * @property {function} dataMap
         */
        this.dataMap = ( opt && opt.dataMap ) ? opt.dataMap : null;

        /**
         * @property {boolean} autoInit
         */
        this.autoInit = ( opt && opt.autoInit ) ? opt.autoInit : false;

        /**
         * @property {function} onChange
         */
        this.onChange = ( opt && opt.onChange ) ? opt.onChange : null;

        /**
         * @readonly
         * @property {HTMLElement} selectedItem
         */
        this.selectedItem = null;

        $( this.HTMLComponent ).
            on( 'change', ( e ) => {
                this.selectedItem = e.currentTarget;
                if ( this.onChange ) this.onChange( this.selectedItem );
            } );

        //

        this._fetcher = new Fetcher( this.url, { method: "GET" } );

        /**
         * @property {array} option
         */
        this.option = {};
        this.option[ 'emptyList' ] = this.findElement( { findIn: this.HTMLComponent, selector: 'option[data-type="emptyList"]' } )
        this.option[ 'prompt' ] = this.findElement( { findIn: this.HTMLComponent, selector: 'option[data-type="prompt"]' } )
        this.option[ 'default' ] = this.findElement( { findIn: this.HTMLComponent, selector: 'option[data-type="default"]' } )
        this.option[ 'error' ] = this.findElement( { findIn: this.HTMLComponent, selector: 'option[data-type="error"]' } )

        if ( this.autoInit )
            this.refresh();
    }

    /**
     * Refresh component
     */
    refresh () {

        // if spinner has declared, show it
        if ( this.HTMLSpinner ) $( this.HTMLSpinner ).show();

        this.HTMLComponent.empty();

        this._fetcher.getJSON()
            .then( ( data ) => {
                // if data object has error properity, throw error
                if ( data.error ) throw new Error( `Can't fetch data into select component` );

                if ( data.length == 0 ) {
                    // if data length is zero, put Empty list info to select list and exit;

                    this.HTMLComponent.append( this.option[ 'emptyList' ] );
                    return false;
                }

                // first in select list is Prompt
                this.HTMLComponent.append( this.option[ 'prompt' ] );

                // secound is Default options (if is exist)
                this.HTMLComponent.append( this.option[ 'default' ] );

                return data;
            } )

            // make options elements from data request
            .then( ( requestData ) => {
                // if no data, exit
                if ( !requestData ) return;

                // prepare data from nonconventional request
                let data;
                if ( this.dataMap )
                    data = this.dataMap( requestData );

                // entry: {Array} where
                // value {number} - value attribute of option element
                // name {string} - inner text of option element
                data.forEach( ( entry ) => {
                    let data = "";
                    if ( entry.data ) {
                        for ( let key in entry.data ) {
                            data += `data-${key}="${entry.data[ key ]}" `;
                        }
                    }
                    let item = $( `<option class="item" ${data} value="${entry.value}">${entry.name}</option>` );
                    this.HTMLComponent.append( item );
                } );

            } )
            .catch( ( err ) => {
                console.error( err );
                this.HTMLComponent.append( this.option[ 'error' ] );
            } )
            .finally( () => {
                console.log( this.option );
                if ( this.option[ 'default' ] )
                    this.option[ 'default' ][ 0 ].selected = true
                else
                    if ( this.option[ 'prompt' ] )
                        this.option[ 'prompt' ][ 0 ].selected = true
                // if HTMLSpinner has declared, hide it
                if ( this.HTMLSpinner )
                    $( this.HTMLSpinner ).hide();
            } );
    }

    // TODO: Make method to select element by value
}