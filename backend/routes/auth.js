const express = require( 'express' );
const passport = require( 'passport' );
const router = express.Router();

/*
 * Local authenticate
 */
router.post( '/login', passport.authenticate( 'local', {
    successRedirect: '/',
    failureRedirect: '/#failure'
} )
);


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
    failureRedirect: '/#failure'
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
}
)
module.exports = router;