const mongoose = require( 'mongoose' );

const UserSchema = new mongoose.Schema( {
    googleId: {
        type: String,
    },
    displayName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        require: true,
    },
    provider: {
        type: String,
    },
    password: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
} );

module.exports = mongoose.model( 'User', UserSchema );