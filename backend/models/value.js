const mongoose = require( 'mongoose' );

const ValueSchema = new mongoose.Schema( {
    examination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Examination',
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    unit: {
        type: String,
        trim: true,
    },
    list: {
        type: String,
        trim: true,
    },
    required: {
        type: Boolean,
        default: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
} );

module.exports = mongoose.model( 'Value', ValueSchema );