const path = require( 'path' );
const webpack = require( 'webpack' );

module.exports = {
    mode: 'development',
    entry: {
        main: './src/js/app.js',
        examinations: './src/js/examinations.js',
        measurements: './src/js/measurements.js',
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js',
    },
    plugins: [
        new webpack.ProvidePlugin( { $: 'jquery', jQuery: 'jquery' } ),
    ],
    watch: true,
    watchOptions: {
        ignored: [ 'node_modules/**' ]
    }
}