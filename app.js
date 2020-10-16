const path = require( 'path' );
const express = require( 'express' );
const mongoose = require( 'mongoose' );
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


// Handlebars helpers
const {
    formatDate,
    eq, neq, lt, eqlt, gt, eqgt, and, or, not,
    isnull, isundefined,
    set, get, zero, inc, dec,
    clearCache,
    cache,
    flushCache,
    greetings
} = require( './helpers/hbs' );

// Handlebars
app.engine(
    '.hbs',
    exphbs( {
        helpers: {
            formatDate,
            eq, neq, lt, eqlt, gt, eqgt, and, or, not,
            isnull, isundefined,
            set, get, zero, inc, dec,
            clearCache,
            cache,
            flushCache,
            greetings,
        },
        extname: '.hbs',
        defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            // allowProtoMethodsByDefault: true,
        }
    } ) );
app.set( 'view engine', '.hbs' );

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
app.use( function ( req, res, next ) {
    res.locals.user = req.user || null;
    next();
} );

// Static folder
app.use( express.static( path.join( __dirname, 'dist' ) ) );
app.use( '/assets', express.static( path.join( __dirname, 'src/assets/' ) ) );
app.use( '/vendor/jquery', express.static( path.join( __dirname, 'node_modules/jquery/dist/' ) ) );
app.use( '/vendor/popper', express.static( path.join( __dirname, 'node_modules/popper.js/dist/umd/' ) ) );
app.use( '/vendor/bootstrap', express.static( path.join( __dirname, 'node_modules/bootstrap/dist/js/' ) ) );
app.use( '/vendor/mdbootstrap', express.static( path.join( __dirname, 'node_modules/mdbootstrap/js/' ) ) );

// Routes
app.use( '/', require( './routes/index' ) );
app.use( '/auth', require( './routes/auth' ) );
app.use( '/examinations', require( './routes/examinations' ) );
app.use( '/groups', require( './routes/groups' ) );
app.use( '/measurements', require( './routes/measurements' ) );
app.use( '/values', require( './routes/values' ) );

//
const PORT = process.env.PORT || 3000;

app.listen(
    PORT,
    console.log( `Server running in ${process.env.NODE_ENV} mode on port ${PORT}` )
);