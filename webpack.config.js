const { parseTwoDigitYear } = require( 'moment' );
const path = require( 'path' );
const webpack = require( 'webpack' );

const entryPath = "src/js";

module.exports = {
    mode: 'development',
    entry: {
        app: path.resolve( __dirname, entryPath, 'app.js' ),
        login: path.resolve( __dirname, entryPath, 'login.js' ),
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: [ 'source-map-loader' ],
            },
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ],
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader',
                options: {
                    rootRelative: '',
                    runtime: path.resolve( __dirname, entryPath, 'helpers/handlebars-helpers.js' ),
                    precompileOptions: {
                        knownHelpersOnly: false,
                    },
                },
            }
        ],
    },
    watch: true,
    watchOptions: {
        ignored: [ 'node_modules/**' ]
    }
}