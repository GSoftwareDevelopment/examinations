const mongoose = require( 'mongoose' );

const MeasurementSchema = new mongoose.Schema( {
    examination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Examination',
        required: true,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    },
    value: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
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

module.exports = mongoose.model( 'Measurement', MeasurementSchema );