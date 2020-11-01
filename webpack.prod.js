const path = require( 'path' );
const common = require( './webpack.common' );
const { merge } = require( 'webpack-merge' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );

const entryPath = "src/js";

module.exports = merge( common, {
    mode: 'production',
    output: {
        path: __dirname + '/dist',
        filename: '[name].[contenthash].bundle.js',
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
        }
    }
} );