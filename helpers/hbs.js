const moment = require( 'moment' );

var _cache = [],
    counters = {};

module.exports = {
    greetings: function () {
        let time = new Date().getHours();
        if ( time < 6 || time >= 18 ) {
            return "Dobry wieczór";
        } else if ( time < 10 ) {
            return "Dzień dobry"
        } else {
            return "Cześć";
        }
    },
    formatDate: function ( date, format ) {
        return moment( date ).format( format );
    },

    // conditional statements
    eq: function ( a, b ) { return ( a == b ); },
    neq: function ( a, b ) { return ( a != b ); },
    lt: function ( a, b ) { return ( a < b ) },
    eqlt: function ( a, b ) { return ( a <= b ) },
    gt: function ( a, b ) { return ( a > b ) },
    eqgt: function ( a, b ) { return ( a >= b ) },
    and: function ( a, b ) { return ( a && b ); },
    or: function ( a, b ) {
        console.log( a || b );
        return ( a || b );
    },
    "not": function ( a ) { return !a; },

    isnull: function ( a ) { return a === null; },
    isundefined: function ( a ) { return a === undefined; },

    // variables
    set: function ( counterName, value ) { counters[ counterName ] = value; },
    get: function ( counterName ) { return counters[ counterName ]; },
    zero: function ( counterName ) { counters[ counterName ] = 0; },
    inc: function ( counterName ) { counters[ counterName ]++; },
    dec: function ( counterName ) { counters[ counterName ]--; },

    // simple cache system
    // @desc    Clear cache buffer
    clearCache: function () {
        _cache = [];
    },
    // @desc    Push data into cache buffer
    cache: function ( options ) {
        let content = options.fn( this );
        _cache.push( content );
    },
    // @desc    Flush buffer
    flushCache: function () {
        if ( _cache.length ) {
            console.log( ` # Flushing cache from ${_cache.length} element(s)` );
            const content = _cache.join( '' );
            _cache = [];
            return content;
        } else {
            console.log( ' # Cache is empty. Nothing to flush.' );
            return "<!-- empty cache -->";
        }
    },
}