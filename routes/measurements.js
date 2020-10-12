const express = require( 'express' );
const router = express.Router();
const { ensureAuth } = require( '../middleware/auth' );

const Examination = require( '../models/examination' );
const Group = require( '../models/group' );

// @desc    Measurements list
// @route   GET /measurements
router.get( '/', ensureAuth, async ( req, res ) => {
    try {
        res.render( 'measurements' );
    } catch ( error ) {
        console.error( error );
        res.render( 'error/500' );
    }
} );

// @desc    Process add new measurement
// @route   POST /measurements
router.post( '/', ensureAuth, async ( req, res ) => {
    req.body.user = req.user.id;
    console.log( req.body );

    try {
        res.render( 'measurements' );
    } catch ( error ) {
        console.error( error );
        res.render( 'error/500' );
    }
} );

module.exports = router;
