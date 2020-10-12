const mongoose = require( 'mongoose' );

const GroupSchema = new mongoose.Schema( {
    name: {
        type: String,
        trim: true,
        required: true,
        unique: false,
    },
    description: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
} );

GroupSchema.index( { user: 1, name: 1 }, { unique: true } );
GroupSchema.plugin( require( 'mongoose-beautiful-unique-validation' ) );

module.exports = mongoose.model( 'Group', GroupSchema );