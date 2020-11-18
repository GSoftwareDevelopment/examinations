const express = require( 'express' );
const router = express.Router();

const Value = require( '../../models/value' );

// @desc    Get values of examinations list
// @route   GET /values
// @return  JSON data
router.get( '/:id', async ( req, res ) => {
	console.log( req.params );

	try {
		if ( req.params.id === 'undefined' ) {
			return res.json( { error: 'Examination ID not specified in body' } );
		}
		const examinationId = req.params.id;
		const values = await Value
			.find( { examination: examinationId } )
			.lean();
		res.json( { 'OK': 1, values } );
	} catch ( error ) {
		console.error( error );
		res.json( { error } );
	}
} );

module.exports = router;