const express = require( 'express' );
const router = express.Router();

const Configure = require( '../../models/configure' );
const Examination = require( '../../models/examination' );
const Group = require( '../../models/group' );
const Value = require( '../../models/value' );

// @desc    Examinations list
// @route   GET /examinations
router.get( '/', async ( req, res ) => {
    try {
        const examinations = await Examination
            .find( { user: req.user.id } )
            .sort( {
                "group": 1,
                "name": 1,
            } )
            .lean();

        res.json( { 'OK': 1, examinations } );
    } catch ( error ) {
        console.error( error );
        res.json( { error } );
    }
} );

// @desc    Process add new examination form
// @route   POST /examination
// @return  JSON data
router.post( '/', ( req, res ) => {
    req.body.user = req.user.id;
    console.log( req.body );

    if ( !req.body.values || !req.body.values.length ) {
        console.error( `Can't process request. There is no values definition.` );
        res.json( {
            error: {
                name: "ValidatorError",
                kind: "values",
                message: "No definition of values"
            }
        } );
        return;
    }

    // if only one value is defined
    // convert string to array with that string,
    if ( typeof req.body.values === 'string' ) {
        req.body.values = [ req.body.values ];
    }

    Examination.create( req.body )
        .then( ( newExamination ) => {
            console.log( 'Response from DB:', newExamination );

            const values = req.body.values.map( ( entry ) => {
                let value;
                if ( typeof entry === 'string' )
                    value = JSON.parse( entry )
                else
                    value = entry;

                if ( typeof value !== 'object' ) {
                    throw new Error( `Wrong value definition ${value}` )
                }

                value.examination = newExamination._id;
                value.user = req.user.id;
                return value;
            } );

            return {
                examinationEntry: newExamination,
                valuesEntry: Value.create( values )
            }
        } )
        .then( ( entrys ) => {
            console.log( 'Response from DB examination:', entrys.examinationEntry );
            console.log( 'Response from DB values:', entrys.valuesEntry );
            res.json( { OK: 1, created: entrys } );
        } )
        .catch( ( error ) => {
            console.log( error );
            res.json( { error } );
        } );
} );

// @desc    Process delete item(s)
// @route   POST /examination
// @return  JSON data
router.delete( '/', ( req, res ) => {
    let selectedItems = req.body;
    if ( !selectedItems ||
        typeof selectedItems !== "object" ||
        !selectedItems instanceof Array ) {
        throw new Error( 'Items is not defined or invalid type.' );
    }
    console.log( '# deleting examination record(s)', selectedItems );

    Examination.deleteMany( { "_id": { $in: selectedItems } } )
        .then( deletedExaminations => {
            console.log( deletedExaminations );
            console.log( '# deleting related values record(s)' );
            return Value.deleteMany( { "examination": { $in: selectedItems } } );
        } )
        .then( deletedValues => {
            console.log( deletedValues );
            res.json( { OK: '1' } );
        } )
        .catch( error => {
            console.error( error );
            res.json( { error } );
        } )
} );

// @desc    Get configuration for Examination List View
// @route   GET /configuration
// @return  JSON data
router.get( '/configuration', async ( req, res ) => {
    try {
        const resource = await Configure
            .find( { resource: 'examination-list-view' } )
            .lean();

        if ( resource.length ) {
            res.json( { 'OK': 1, data: resource[ 0 ].data } )
        } else {
            console.info( `Resource 'examination-list-view' not found.` );
            res.json( { 'OK': 0 } );
        }

    } catch ( error ) {
        console.error( error );
        res.json( { error } )
    }
} );

// @desc    Store configuration for Examination List View
// @route   POST /configuration
// @return  JSON data
router.post( '/configuration', async ( req, res ) => {
    console.log( req.body );

    try {
        const conf = await Configure.updateOne(
            { user: req.user.id, resource: 'examination-list-view' },
            { data: req.body },
            { upsert: true }
        );
        console.log( conf );

        res.json( { 'OK': 1 } );
    } catch ( error ) {
        console.log( error );
        res.json( { error } );
    }
} );

module.exports = router;