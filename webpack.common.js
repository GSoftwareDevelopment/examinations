const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const entryPath = "src/js";

module.exports = {
    context: __dirname,
    entry: {
        app: path.resolve( __dirname, entryPath, 'app.js' ),
    },
    plugins: [
        new MiniCssExtractPlugin( {
            filename: './css/[name].css'
        } ),
        new HtmlWebpackPlugin( {
            template: './src/index.html',
        } ),
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
                    runtime: path.resolve( __dirname, entryPath, 'helpers/handlebars-helpers.js' ),
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
    }
}