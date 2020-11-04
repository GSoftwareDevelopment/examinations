const LocalStrategy = require( 'passport-local' ).Strategy;
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const FacebookStrategy = require( 'passport-facebook' ).Strategy;

const bcrypt = require( 'bcryptjs' );
const mongoose = require( 'mongoose' );
const User = require( '../models/user' );

module.exports = function ( passport ) {
    // Local
    passport.use(
        new LocalStrategy( {
            usernameField: 'email',
            passwordField: 'password',
        },
            async ( email, password, done ) => {
                console.log( email, password );

                try {
                    console.log( 'Checking user...' );
                    const user = await User.findOne( { email } );

                    if ( !user ) {
                        console.error( 'ERROR: User is not registered.' )
                        return done( null, false, { message: 'User is not registered' } );
                    }

                    if ( !user.password ) {
                        console.log( 'Error: User password is incorrect.' );
                        return done( null, false, { message: 'Password is invalid' } );
                    }

                    if ( await bcrypt.compare( password, user.password ) ) {
                        console.log( 'User is correctly logged' );
                        return done( null, user );
                    } else {
                        console.error( 'ERROR: User password is incorrect.' )
                        return done( null, false, { message: 'Password is incorrect' } );
                    }

                } catch ( error ) {
                    console.error( error );
                    done( error );
                }
            }
        ) );

    // Google
    passport.use(
        new GoogleStrategy( {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback'
        },
            async ( accessToken, refreshToken, profile, done ) => {
                // console.log( profile );
                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[ 0 ].value,
                    email: profile.emails[ 0 ].value,
                    provider: 'google',
                };

                try {
                    console.info( 'Checking a user...' )
                    let user = await User.findOne( { googleId: profile.id } );
                    if ( user ) {
                        console.info( 'The user is already registered in the system.' )
                        done( null, user );
                    } else {
                        console.info( 'New user regstration.' )
                        user = await User.create( newUser );
                        done( null, user );
                    }
                } catch ( error ) {
                    console.error( error );
                }
            } )
    );

    // Facebook
    passport.use(
        new FacebookStrategy( {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
            callbackURL: 'http://localhhost:3000/auth/facebook/callback'
        },
            async ( accessToken, refreshToken, profile, done ) => {
                console.log( profile );
                const newUser = {
                    googleId: profile.id,
                    lastName: profile.name.familyName,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    image: profile.photos[ 0 ].value,
                    email: profile.emails[ 0 ].value,
                    provider: 'facebook',
                };

                try {
                    let user = await User.findOne( { googleId: profile.id } );
                    if ( user ) {
                        done( null, user );
                    } else {
                        user = await User.create( newUser );
                        done( null, user );
                    }
                } catch ( error ) {
                    console.error( error );
                }
            } )
    );

    // Serialize && deserialize

    passport.serializeUser( ( user, done ) => {
        done( null, user.id );
    } );

    passport.deserializeUser( ( id, done ) => {
        User.findById( id, ( err, user ) => {
            done( err, user );
        } );
    } );

}
