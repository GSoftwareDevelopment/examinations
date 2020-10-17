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

module.exports = router;