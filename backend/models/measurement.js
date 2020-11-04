const mongoose = require( 'mongoose' );

const ResultSchema = new mongoose.Schema( {
    value: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Value'
    },
    result: {
        type: String,
    },
    description: {
        type: String,
        trim: true,
    },
} );

const MeasurementSchema = new mongoose.Schema( {
    examination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Examination',
        required: true,
    },
    values: [ ResultSchema ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        required: true,
    }
} );

module.exports = {
    Measurement: mongoose.model( 'Measurement', MeasurementSchema ),
    Result: mongoose.model( 'Result', ResultSchema ),
}