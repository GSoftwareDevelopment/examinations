const path = require( 'path' );
const common = require( './webpack.common' );
const { merge } = require( 'webpack-merge' );

const entryPath = "src/js";

module.exports = merge( common, {
    mode: 'development',
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js',
    },
    watch: true,
    watchOptions: {
        ignored: [ 'node_modules/**' ]
    },
    devServer: {
        contentBase: path.join( __dirname, 'dist' ),
        compress: true,
        port: 9000
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
} );