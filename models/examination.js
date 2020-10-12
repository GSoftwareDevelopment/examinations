const mongoose = require( 'mongoose' );

const ExaminationSchema = new mongoose.Schema( {
    name: {
        type: String,
        trim: true,
        required: true,
        unique: false,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        unique: false,
    },
    description: {
        type: String,
        trim: true,
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

ExaminationSchema.index( { user: 1, group: 1, name: 1 }, { unique: true } );
ExaminationSchema.plugin( require( 'mongoose-beautiful-unique-validation' ) );

module.exports = mongoose.model( 'Examination', ExaminationSchema );