const express = require( 'express' );
const router = express.Router();
const { ensureAuth } = require( '../middleware/auth' );
const mongoose = require( 'mongoose' );

const Examination = require( '../models/examination' );
const { Measurement } = require( '../models/measurement' );
const Configure = require( '../models/configure' );

const Group = require( '../models/group' );
const Value = require( '../models/value' );

// @desc    Examinations list
// @route   GET /examinations
router.get( '/', ensureAuth, async ( req, res ) => {
    res.render( 'examinations' );
} );

module.exports = router;