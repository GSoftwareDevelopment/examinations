const path = require( "path" );
const express = require( 'express' );
const router = express.Router();
const { ensureAuth, ensureGuest } = require( '../middleware/auth' );

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