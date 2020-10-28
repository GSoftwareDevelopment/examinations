const express = require( 'express' );
const router = express.Router();
const { ensureAuth } = require( '../../middleware/auth' );
const mongoose = require( 'mongoose' );

const Configure = require( '../../models/configure' );
const Examination = require( '../../models/examination' );
const { Measurement } = require( '../../models/measurement' );
const Group = require( '../../models/group' );
const Value = require( '../../models/value' );

// @desc    Examinations list
// @route   GET /examinations
router.get( '/', ensureAuth, async ( req, res ) => {
    try {
        const lists = await Examination
            .find( { user: req.user.id } )
            .sort( {
                "group": 1,
                "name": 1,
            } )
            .populate( 'group' )
            .lean();

        const groups = await Group
            .find( { user: req.user.id } )
            .sort( { name: 1 } )
            .lean();

        res.json( { lists, groups } );
    } catch ( error ) {
        console.error( error );
        res.json( { error } );
    }
} );

// @desc    Process add new examination form
// @route   POST /examination
// @return  JSON data
router.post( '/', ensureAuth, ( req, res ) => {
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
            console.log( newExamination );

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

            console.log( values );
            return Value.create( values );
        } )
        .then( ( valuesEntry ) => {
            console.log( valuesEntry );
            res.json( { OK: 1 } );
        } )
        .catch( ( err ) => {
            console.log( err );
            res.json( { error: err.errors.name } );
        } );
} );

// @desc    Process delete item(s)
// @route   POST /examination
// @return  JSON data
router.delete( '/', ensureAuth, async ( req, res ) => {
    let selectedItems = req.body;
    console.log( req.body );
    try {
        if ( !selectedItems ||
            typeof selectedItems !== "object" ||
            !selectedItems instanceof Array ) {
            throw new Error( 'Items is not defined or invalid type.' );
        }

        console.log( '# deleting examination record(s)', selectedItems );
        let result1 = await Examination.deleteMany( {
            "_id": {
                $in: selectedItems
            }
        } );
        console.log( result1 );

        console.log( '# deleting related values record(s)' );
        let result2 = await Value.deleteMany( {
            "examination": {
                $in: selectedItems
            }
        } );
        console.log( result2 );

        res.json( { result1, result2 } );
    } catch ( error ) {
        console.error( error );
        res.json( { error } );
    }
} );

// @desc    Get configuration for Examination List View
// @route   GET /configuration
// @return  JSON data
router.get( '/configuration', ensureAuth, async ( req, res ) => {
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
router.post( '/configuration', ensureAuth, async ( req, res ) => {
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