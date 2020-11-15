module.exports = {
    ensureAuth: function ( req, res, next ) {
        if ( req.isAuthenticated() ) {
            console.log( 'Access ok' )
            return next();
        } else {
            console.log( 'Access denied! You are not logged.' )
            // res.redirect( '/auth/failure' )
            return next();
        }
    },
    ensureGuest: function ( req, res, next ) {
        if ( req.isAuthenticated() ) {
            res.redirect( '/' );
        } else {
            return next();
        }
    }
}