const Handlebars = require( 'handlebars/runtime' );
const { formatTime, formatDate } = require( './../class/misc' );

// Date & Time

Handlebars.registerHelper( 'formatDate', function ( date ) {
    return formatDate( new Date( date ) );
} );

Handlebars.registerHelper( 'formatTime', function ( date ) {
    return formatTime( new Date( date ) );
} );

// Conditional

Handlebars.registerHelper( 'eq', function ( a, b ) { return ( a == b ); } );
Handlebars.registerHelper( 'neq', function ( a, b ) { return ( a != b ); } );
Handlebars.registerHelper( 'lt', function ( a, b ) { return ( a < b ); } );
Handlebars.registerHelper( 'eqlt', function ( a, b ) { return ( a <= b ); } );
Handlebars.registerHelper( 'gt', function ( a, b ) { return ( a > b ); } );
Handlebars.registerHelper( 'eqgt', function ( a, b ) { return ( a >= b ); } );

// Logical operation

Handlebars.registerHelper( 'and', function ( a, b ) { return ( a && b ); } );
Handlebars.registerHelper( 'or', function ( a, b ) { return ( a || b ); } );
Handlebars.registerHelper( 'not', function ( a ) { return ( !a ); } );

// Type check

Handlebars.registerHelper( 'isNull', function ( a ) { return ( typeof a === "null" ); } );
Handlebars.registerHelper( 'isUndefined', function ( a ) { return ( typeof a === "undefined" ); } );
Handlebars.registerHelper( 'isNumber', function ( a ) { return ( typeof a === "number" ); } );
Handlebars.registerHelper( 'isString', function ( a ) { return ( typeof a === "string" ); } );
Handlebars.registerHelper( 'isObject', function ( a ) { return ( typeof a === "object" ); } );

// Counters

var counters = {};

Handlebars.registerHelper( 'set', function ( name, value ) { counters[ name ] = value; } );
Handlebars.registerHelper( 'get', function ( name ) { return counters[ name ]; } );
Handlebars.registerHelper( 'zero', function ( name ) { counter[ name ] = 0; } );
Handlebars.registerHelper( 'inc', function ( name ) { counter[ name ]++; } );
Handlebars.registerHelper( 'dec', function ( name ) { counter[ name ]--; } );
Handlebars.registerHelper( 'isZero', function ( name ) { return counter[ name ] === 0; } );

// Iterations

Handlebars.registerHelper( 'loop', function ( from, to, opt ) {
    let accum = '',
        data = {};

    from = getOp( from, 'Invalid "from" operand' );
    to = getOp( to, 'Invalid "to" operand' );

    for ( let i = from; i <= to; i++ ) {
        data.index = i;
        data.first = ( i === from );
        data.last = ( i === to );
        accum += opt.fn( this, { data } );
    }
    return accum;
} );

// Math

function getOp ( op, errMsg ) {
    if ( typeof op === 'string' )
        return counters[ op ]
    else if ( typeof op === 'number' )
        return op
    else
        return 0
}

Handlebars.registerHelper( 'add', function ( a, b ) {
    let opA = getOp( a, 'Invalid left operand' );
    let opB = getOp( b, 'Invalid right operand' );
    return ( opA + opB );
} );
Handlebars.registerHelper( 'sub', function ( a, b ) {
    let opA = getOp( a, 'Invalid left operand' );
    let opB = getOp( b, 'Invalid right operand' );
    return ( opA - opB );
} );
Handlebars.registerHelper( 'mul', function ( a, b ) {
    let opA = getOp( a, 'Invalid left operand' );
    let opB = getOp( b, 'Invalid right operand' );
    return ( opA * opB );
} );
Handlebars.registerHelper( 'div', function ( a, b ) {
    let opA = getOp( a, 'Invalid left operand' );
    let opB = getOp( b, 'Invalid right operand' );
    return ( opA / opB );
} );

Handlebars.registerHelper( 'isEven', function ( a ) {
    return ( a % 2 == 0 );
} );

Handlebars.registerHelper( 'isOdd', function ( a ) {
    return ( a % 2 == 1 );
} );

Handlebars.registerHelper( 'limitMin', function ( a, limit ) {
    a = getOp( a, 'Invalid first operand' )
    limit = getOp( limit, 'Invalit limit operand' )
    return ( a < limit ? a = limit : a );
} );

Handlebars.registerHelper( 'limitMax', function ( a, limit ) {
    a = getOp( a, 'Invalid first operand' )
    limit = getOp( limit, 'Invalit limit operand' )
    return ( a > limit ? a = limit : a );
} );

module.exports = Handlebars;