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
        const lists = await Measurement
            .find( { user: req.user.id } )
            .sort( {
                "createdAt": 1,
            } )
            .populate( 'examination' )
            .populate( 'values' )
            .populate( 'values.value' )
            .lean();

        console.log( lists[ 0 ] );
        res.render( 'measurements', {
            lists
        } );
    } catch ( error ) {
        console.error( error );
        res.render( 'error/500' );
    }
} );

// @desc    Process add new measurement
// @route   POST /measurements
// @return  JSON data
router.post( '/', ensureAuth, async ( req, res ) => {

    let MeasurementBase = {
        examination: req.body.examination,
        user: req.user.id,
        createdAt: Date.parse( `${req.body.date} ${req.body.time}` )
    };

    let values = new Array();
    for ( let key in req.body ) {
        if ( key.slice( 0, 6 ).toLowerCase() === 'value-' ) {
            let valueID = key.slice( 6 );
            values.push( {
                value: new mongoose.Types.ObjectId( valueID ),
                result: req.body[ key ]
            } )
        }
    }

    try {
        const result = await Measurement.create( {
            values,
            ...MeasurementBase
        } );
        res.json( result );
    } catch ( error ) {
        console.error( error );
        res.json( { error } )
    }
} );

module.exports = router;
