const express = require( 'express' );
const router = express.Router();
const { ensureAuth } = require( '../../middleware/auth' );

const Value = require( '../../models/value' );

// @desc    Get values of examinations list
// @route   GET /values
// @return  JSON data
router.get( '/:id', ensureAuth, async ( req, res ) => {
    const id = req.params.id;
    try {
        const values = await Value
            .find( { examination: id } )
            .lean();
        res.json( values );
    } catch ( error ) {
        console.error( error );
        res.json( { error } );
    }
} );

module.exports = router;