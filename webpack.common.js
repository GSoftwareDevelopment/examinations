const path = require( 'path' );
const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

const nodeDir = __dirname + '/node_modules';
const jsDir = "src/js";

module.exports = {
    context: __dirname,
    entry: {
        // vendors: [ "jquery", "bootstrap" ],
        minix: [ 'gsd-minix', 'gsd-minix/components' ],
        app: path.resolve( __dirname, jsDir, 'app.js' ),
    },
    // resolve: {
    //     alias: {
    //         'jquery': nodeDir + '/jquery/dist/jquery.js'
    //     }
    // },
    plugins: [
        new MiniCssExtractPlugin( {
            filename: './css/[name].css'
        } ),
        new HtmlWebpackPlugin( {
            template: './src/index.html',
        } ),
        // new webpack.ProvidePlugin( { $: 'jquery', jQuery: 'jquery' } ),
        new CopyWebpackPlugin( {
            patterns: [
                { from: './src/assets', to: './assets' }
            ]
        } )
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: [ 'source-map-loader' ],
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader',
                options: {
                    rootRelative: '',
                    runtime: path.resolve( __dirname, jsDir, 'helpers/handlebars-helpers.js' ),
                    precompileOptions: {
                        knownHelpersOnly: false,
                    },
                },
            },
            {
                test: /\.html$/,
                use: [ 'html-loader' ],
            },
            {
                test: /\.(svg|jpg|jpeg|png|gif)(\?.*)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        context: 'src',
                    }
                }
            },
            {
                test: /\.(eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    }
                }
            },
            {
                test: /\.s?css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
}