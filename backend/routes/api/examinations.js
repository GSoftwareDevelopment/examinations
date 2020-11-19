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

// @desc    Process examination data with values definition
// @route   POST /examination/created	- add new entry
// @route		POST /examination/:id			- update entry
// @return	JSON data
router.post( '/:id', async ( req, res ) => {

	console.log( 'Params: ', req.params );
	console.log( 'Body: ', req.body );

	let { values, ...examinationBody } = req.body;

	let processValues = values && values.length > 0;
	if ( req.params.id === "created" && ( !values || !values.length ) ) {
		console.error( `Can't create examination without values definitions.` );
		return res.json( {
			error: {
				name: "ValidatorError",
				kind: "values",
				message: "No values definitions"
			}
		} );
	}

	if ( processValues )
		for ( value of values ) {
			if ( typeof value !== 'object' ) {
				console.error( `Can't process request. Wrong value type: ${typeof value}` );
				return res.json( {
					error: {
						name: "ValidatorError",
						kind: "values",
						message: `Wrong value type: ${typeof value}`
					}
				} );
			}
		}

	try {

		let examinationId, response = {};

		if ( req.params.id !== 'create' ) {
			examinationId = req.params.id;
			response.updated = await Examination.findOneAndUpdate(
				{ user: req.user.id, "_id": examinationId },
				examinationBody,
				{ upsert: true }
			)
		} else {
			response.created = await Examination.create( { ...examinationBody, user: req.user.id } );
			console.log( response.created );

			if ( processValues ) {
				examinationId = response.created._id;
				values.forEach( value => {
					value.examination = examinationId;
					value.user = req.user.id;
				} );
			}
		}

		if ( processValues ) {
			const valuesToDelete = values
				.filter( item => item.action === 'delete' )
				.map( item => item.id );
			const valuesToCreate = values
				.filter( item => item.action === 'create' )
				.map( item => { delete item.id; return item } );

			const idsToUpdate = [];
			const valuesToUpdate = values
				.filter( item => item.action === 'update' )
				.map( item => {
					idsToUpdate.push( item.id );
					delete item.id;
					return item;
				} );

			response.values = {}

			if ( valuesToCreate.length > 0 )
				response.values.created = await Value.create( valuesToCreate );

			if ( idsToUpdate.length > 0 )
				response.values.updated = idsToUpdate.map( async ( itemId, index ) => {
					return await Value.findByIdAndUpdate( itemId, { ...valuesToUpdate[ index ] } )
				} );
			if ( valuesToDelete.length > 0 )
				response.values.deleted = await Value.deleteMany( { "_id": { $in: valuesToDelete } } );
		}

		console.log( 'Responses:', response );

		res.json( { OK: 1, ...response } );

	} catch ( error ) {
		console.log( error );
		res.json( { error } );
	}

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