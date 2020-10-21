export default class Component {
    constructor() {

    }

    /**
     * Initial parameters for findElement function
     * @typedef {Object} findElementParams
     * @property {JQuery<HTMLElement>} [findIn] - jQuery element
     * @property {string} selector - selector
     */

    /**
     * The function searches for selector (param.selector) in the DOM tree, and by setting where to look (parm.findIn), it allows you to search in a specific element.
     * @param {findElementParams} params
     * @returns {jQuery<HTMLElement>} jQuery element
     */
    findElement ( params ) {

        if ( typeof params !== 'object' ) return undefined;

        if ( params.selector ) {
            let selector;

            if ( params.findIn ) {
                selector = $( params.findIn ).find( params.selector );
            } else {
                selector = $( params.selector );
            }
            if ( selector.length == 0 )
                return null
            else
                return selector;
        } else {
            return undefined;
        }
    }

}