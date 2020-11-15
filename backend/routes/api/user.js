const express = require( 'express' );
const router = express.Router();
const { ensureAuth } = require( '../../middleware/auth' );

// @desc    Get user information if logged
// @route   GET /user
// @return  JSON data
router.get( '/', async ( req, res, next ) => {
    if ( req.user ) {
        res.json( req.user );
    } else {
        res.json( { error: 'Access denied! You are not authorized' } );
    }
} );

module.exports = router;