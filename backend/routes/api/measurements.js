const express = require( 'express' );
const router = express.Router();
const mongoose = require( 'mongoose' );

const Examination = require( '../../models/examination' );
const { Measurement, Result } = require( '../../models/measurement' );

// @desc    Measurements list
// @route   GET /measurements
router.get( '/', async ( req, res ) => {
    try {
        const limit = parseInt( req.query.limit ) || 0;
        const page = parseInt( req.query.page ) || 0;

        const measurements = await Measurement
            .find( { user: req.user.id } )
            .sort( {
                "createdAt": -1,
            } )
            .limit( limit )
            .skip( page * limit )
            .populate( 'examination' )
            .populate( 'values' )
            .populate( 'values.value' )
            .lean();

        const count = await Measurement.countDocuments();

        res.json( { totalResults: count, currentPage: page, measurements } )

    } catch ( error ) {
        console.error( error );
        res.json( { error } );
    }
} );

// @desc    Get latest measurement
// @route   GET /measurements/latest?{examinationId=}
router.get( '/latest', async ( req, res ) => {
    try {
        dbquery = {};
        if ( req.query.examinationId ) {
            dbquery = {
                examination: new mongoose.Types.ObjectId( req.query.examinationId )
            };
        }

        const latest = await Measurement
            .find( {
                user: req.user.id,
                ...dbquery
            } )
            .sort( { createdAt: -1 } )
            .limit( 1 )
            .populate( 'examination' )
            .populate( 'values' )
            .populate( 'values.value' )
            .lean();


        res.json( latest );
    } catch ( error ) {
        console.error( error );
        res.json( { error } )
    }
} );

// @desc    Process add new measurement
// @route   POST /measurements
// @return  JSON data
router.post( '/', async ( req, res ) => {

    let MeasurementBase = {
        examination: req.body.examination,
        user: req.user.id,
        createdAt: Date.parse( `${req.body.date} ${req.body.time}` )
    };
    console.log( req.body );

    let values = new Array();
    for ( let key in req.body ) {
        if ( key.slice( 0, 6 ).toLowerCase() === 'value-' ) {
            let valueID = key.slice( 6 );
            let valueDesc = req.body[ `description-${valueID}` ] || '';
            values.push( {
                value: new mongoose.Types.ObjectId( valueID ),
                result: req.body[ key ],
                description: valueDesc,
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
