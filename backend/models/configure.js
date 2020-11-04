const mongoose = require( 'mongoose' );

const ConfigureSchema = new mongoose.Schema( {
    resource: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    data: {},
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

ConfigureSchema.index( { user: 1, resource: 1 }, { unique: true } );
ConfigureSchema.plugin( require( 'mongoose-beautiful-unique-validation' ) );

module.exports = mongoose.model( 'Configure', ConfigureSchema );