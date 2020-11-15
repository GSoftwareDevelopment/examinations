const express = require( 'express' );
const passport = require( 'passport' );
const jwt = require( 'jsonwebtoken' );
const router = express.Router();
const bcrypt = require( 'bcryptjs' );

const User = require( '../models/user' );

/*
 * Local authenticate
 */
router.post( '/login', ( req, res, next ) => {
    console.log( '# Loging...' );

    console.log( req.body );

    if ( !req.body.email || !req.body.password ) {
        const errMsg = 'Authenticate require User e-mail & password';
        console.log( errMsg )
        return res.status( 400 ).json( { message: errMsg } );
    }

    passport.authenticate( 'local', { session: false }, ( err, user, info ) => {
        if ( err || !user ) {
            console.log( err, info );
            return res.status( 400 ).json( {
                message: info ? info.message : 'Login failed',
                user
            } )
        }

        req.login( user, { session: false }, ( err ) => {
            if ( err ) {
                res.json( { error: err } );
            }

            const token = jwt.sign( { _id: user._id }, process.env.JWT_SECRET );
            return res.json( { user, token } )
        } );

    } )( req, res, next );
} );

/*
 * Local authenticate
 */
router.post( '/register', async ( req, res, next ) => {
    console.log( '# Registering new user...' );
    console.log( req.body );

    if ( !req.body.email || !req.body.displayName || !req.body.password ) {
        const errMsg = 'Require User e-mail, name (first & last) and password for registration';
        console.log( errMsg )
        return res.status( 400 ).json( { message: errMsg } );
    }

    try {
        let user = await User.findOne( { email: req.body.email, provider: 'local' } );
        if ( user ) {
            const errMsg = 'The user is already registered in the system.'
            console.info( errMsg )
            return res.json( { message: errMsg } );
        }

        const salt = await bcrypt.genSalt( 10 );
        const hashedPassword = await bcrypt.hash( req.body.password, salt );

        const newUser = {
            displayName: req.body.displayName,
            email: req.body.email,
            password: hashedPassword,
            provider: 'local',
        }

        const result = await User.create( newUser );
        delete result.password;
        console.log( result );
        res.json( { "OK": 1, created: result } )
    } catch ( error ) {
        console.log( error );
        res.json( { error } );
    }
} );

/*
 * Google authenticate
 */

// @desc    Auth with Google
// @route   GET /auth/google
router.get( '/google', passport.authenticate( 'google', { scope: [ 'email', 'profile' ] } ) );

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get( '/google/callback', passport.authenticate( 'google', {
    successRedirect: '/api/user',
    failureRedirect: '/failure'
} )
);

/*
 * Facebook authenticate
 */

// @desc    Auth with Facebook
// @route   GET /auth/facebook
router.get( '/facebook', passport.authenticate( 'facebook', { scope: [ 'id', 'displayName' ] } ) );

// @desc    Facebook auth callback
// @route   GET /auth/facebook/callback
router.get( '/facebook/callback', passport.authenticate( 'facebook', {
    successRedirect: '/',
    failureRedirect: '/#failure'
} )
);

// @desc    Logout user
// @route   GET /auth/logout
router.get( '/logout', ( req, res ) => {
    req.logout();
    res.redirect( '/' );
} );

module.exports = router;