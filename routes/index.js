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

module.exports = router;