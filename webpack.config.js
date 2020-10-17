const { parseTwoDigitYear } = require( 'moment' );
const path = require( 'path' );
const webpack = require( 'webpack' );

const entryPath = "./src/js";

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
                    runtime: path.resolve( __dirname, 'src/js/helpers/handlebars-helpers.js' )
                }
            }
        ],
    },
    // plugins: [
    //     new webpack.ProvidePlugin( { $: 'jquery', jQuery: 'jquery' } ),
    // ],
    watch: true,
    watchOptions: {
        ignored: [ 'node_modules/**' ]
    }
}