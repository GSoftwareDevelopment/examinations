const express = require( 'express' );
const router = express.Router();

const Examination = require( '../../models/examination' );
const Group = require( '../../models/group' );
const Value = require( '../../models/value' );

// @desc    Examinations groups list
// @route   GET /groups
// @return  JSON data
router.get( '/', async ( req, res, next ) => {
    try {
        const groups = await Group
            .find( { user: req.user.id } )
            .sort( {
                "name": 1,
            } )
            .lean();
        return res.json( { 'OK': 1, groups } );
    } catch ( error ) {
        console.error( error );
        res.json( { error } );
    }
} );

// @desc    Create new group
// @route   POST /groups
// @return  JSON data
router.post( '/', ( req, res ) => {
    req.body.user = req.user.id;
    console.log( req.body );

    Group.create( req.body )
        .then( ( newGroup ) => {
            console.log( newGroup );
            res.json( { 'OK': 1, created: newGroup } );
        } )
        .catch( ( error ) => {
            console.log( error );
            res.json( { error: error.errors.name } );
        } )
} );

// @desc    Process delete group(s)
// @route   POST /groups
// @return  JSON data
router.delete( '/', ( req, res ) => {
    let selectedGroups = req.body;
    console.log( req.body );
    if ( !selectedGroups ||
        typeof selectedGroups !== "object" ||
        !selectedGroups instanceof Array ) {
        return res.status( 422 ).json( { error: 'Groups is not defined or invalid type.' } );
    }

    /*
        order of tasks:
        1. delete selected groups
        2. get is's of examinations belonging to groups
        3. delete values belonging to examinations
        4. delete examinations.
    */
    Group.deleteMany( { "_id": { $in: selectedGroups } } ) // #1
        .then( ( groups ) => {
            console.log( groups );
            return Examination.find( { "group": { $in: selectedGroups } } ); // #2
        } )
        .then( ( result ) => {
            const examinationsIDs = result.map(
                ( entry ) => {
                    return entry._id;
                } );
            console.log( examinationsIDs );

            return Value.deleteMany( { "examination": { $in: examinationsIDs } } ); // #3
        } )
        .then( ( result ) => {
            console.log( result );
            return Examination.deleteMany( { "group": { $in: selectedGroups } } ); // #4
        } )
        .then( ( result ) => {
            console.log( result );
            res.json( { OK: 1 } );
        } )
        .catch( ( error ) => {
            console.log( error );
            res.status( 500 ).json( { error } );
        } );

} );

module.exports = router;