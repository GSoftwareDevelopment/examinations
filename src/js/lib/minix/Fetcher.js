/**
 * Fetcher Class - extends basic Fetch API
 * @module Fetcher
 */
import withQuery from 'with-query';

export class Fetcher {
    /**
     * Init fetcher
     * @param {string} url - URL address
     * @param {RequestInit} options - Initialize request options.
     */
    constructor( url, options ) {
        /**
         * @property {string} url - URL address
         */
        this.url = url;

        /**
         * @property {RequestInit} options - Request options
         */
        this.options = options;
    }

    /**
     * Call fetch with JSON content type
     * @param {RequestInit} extraOptions - Extends request option.
     * Have a dedicated property 'queryParams" to resolve query parameters.
     * This options overwrite initate options!
     * @returns {Promise} - Promise from fetch
     */
    async getJSON ( extraOptions ) {
        let query = {};

        if ( extraOptions && extraOptions.queryParams ) {
            query = extraOptions.queryParams;
            delete extraOptions.queryParams;
        }

        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            ...this.options,
            ...extraOptions
        }

        try {
            const response = await fetch( withQuery( this.url, query ), options );

            if ( !response.ok ) {
                const message = `An error has occured: ${response.status}`;
                throw new Error( message );
            }

            const data = await response.json();
            return data;
        } catch ( error ) {
            if ( this.options.reportError )
                console.error( error );
            return { error }
        }
    }

    /**
     * Call fetch with HTML content type
     * @returns {Promise} - Promise from fetch
     */
    async getHTML () {
        this.options = {
            headers: {
                'Content-Type': 'text/html'
            },
            ...this.options
        }

        try {
            const response = await fetch( this.url, this.options );

            if ( !response.ok ) {
                const message = `An error has occured: ${response.status}`;
                throw new Error( message );
            }

            const data = await response.text();
            return data;
        } catch ( error ) {
            if ( this.options.reportError )
                console.error( error );
            return { error }
        }
    }
}
