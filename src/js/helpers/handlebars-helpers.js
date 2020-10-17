const Handlebars = require( 'handlebars/runtime' );
const { formatTime, formatDate } = require( './../class/misc' );

Handlebars.registerHelper( 'formatDate', function ( date ) {
    return formatDate( new Date( date ) );
} );

Handlebars.registerHelper( 'formatTime', function ( date ) {
    return formatTime( new Date( date ) );
} );

module.exports = Handlebars;