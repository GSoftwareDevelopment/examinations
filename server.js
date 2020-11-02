const path = require( 'path' );
const express = require( 'express' );
const mongoose = require( 'mongoose' );
const cors = require( 'cors' );
const dotenv = require( 'dotenv' );
const morgan = require( 'morgan' );
const exphbs = require( 'express-handlebars' );
const methodOverride = require( 'method-override' );
const passport = require( 'passport' );
const session = require( 'express-session' );
const MongoStore = require( 'connect-mongo' )( session );
const connectDB = require( './config/db' );

// Load config
dotenv.config( { path: './config/config.env' } );

// Passport config
require( './config/passport' )( passport );

connectDB();

const app = express();


// Body parser
app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );

app.use( cors( {
    origin: '*',
    methods: "GET,POST,PATCH,DELETE,PUT",
    allowedHeaders: "Content-Type, Authorization",
} ) );

// Method override middleware
app.use( methodOverride( function ( req, res ) {
    if ( req.body && typeof req.body === 'object' && '_method' in req.body ) {
        // look it urlencoded POST bodies and delete it
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
} ) );

// Logging
if ( process.env.NODE_ENV === 'development' ) {
    app.use( morgan( 'dev' ) ); 1
}

// Session 
app.use(
    session( {
        secret: 'O! LoL its a Tr0ll',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore( { mongooseConnection: mongoose.connection } )
    } )
);

// Passport middleware
app.use( passport.initialize() );
app.use( passport.session() );

// Set globar variable
// TODO: Usuń w przyszłości
app.use( function ( req, res, next ) {
    res.locals.user = req.user || null;
    next();
} );

// Static folder
app.use( express.static( path.join( __dirname, 'dist' ) ) );

// API Routes
app.use( '/auth', require( './routes/auth' ) );
app.use( '/api/user', require( './routes/api/user' ) );
app.use( '/api/examinations', require( './routes/api/examinations' ) );
app.use( '/api/groups', require( './routes/api/groups' ) );
app.use( '/api/values', require( './routes/api/values' ) );
app.use( '/api/measurements', require( './routes/api/measurements' ) );

//
const PORT = process.env.PORT || 3000;

app.listen(
    PORT,
    '0.0.0.0',
    console.log( `Server running in ${process.env.NODE_ENV} mode on port ${PORT}` )
);