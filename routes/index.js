const path = require( "path" );
const express = require( 'express' );
const router = express.Router();
const { ensureAuth, ensureGuest } = require( '../middleware/auth' );

// @desc    Login/Landing page
// @route   GET /
router.get( '/', ensureGuest, ( req, res ) => {
    res.render( 'login', {
        layout: 'login'
    } );
} );

// @desc    Register new user form
// @route   GET /register
router.get( '/register', ensureGuest, ( req, res ) => {
    res.render( 'register', {
        layout: 'login'
    } );
} );

// @desc    Forgot password form
// @route   GET /
router.get( '/forgot', ensureGuest, ( req, res ) => {
    res.render( 'forgot', {
        layout: 'login'
    } );
} );

/*
 *
 */

// @desc    Dashboard
// @route   GET /dashboard
router.get( '/dashboard', ensureAuth, async ( req, res ) => {
    try {
        res.render( 'dashboard', {
            name: req.user.firstName,
        } );
    } catch ( error ) {
        console.error( error );
        res.render( 'error/500' );
    }
} );

// @desc    Get template file
// @route   GET /template/:id
router.get( '/template/:name', ensureAuth, ( req, res, next ) => {
    const options = {
        root: path.join( __dirname, '../', 'views/partials' ),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }

    let fileName = req.params.name.split( '.' ).join( '/' );
    console.log( fileName );

    res.sendFile( fileName + '.hbs', options, function ( err ) {
        if ( err ) {
            res.sendStatus( 404 );
        } else {
            console.log( 'Sent:', fileName )
        }
    } )
} );

module.exports = router;