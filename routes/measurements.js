const express = require( 'express' );
const router = express.Router();
const { ensureAuth } = require( '../middleware/auth' );
const mongoose = require( 'mongoose' );

const Examination = require( '../models/examination' );
const { Measurement, Result } = require( '../models/measurement' );

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

module.exports = router;
