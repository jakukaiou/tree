var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var productionConfig = [{
    entry: {
        content: './client/content',
        page2: './client/page2'
    },
    output: {
        filename: './[name]/bundle.js',
        path: path.resolve(__dirname, './public'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.jpg','.ts', '.webpack.js', '.web.js', '.js']
    },
    module: {
        rules: [{
            test: /\.(png|jpg|svg)$/,
            use: 'url-loader?limit=8192&context=client&name=[path][name].[ext]'
        }, {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader?sourceMap',
                'resolve-url-loader',
                'sass-loader?sourceMap'
            ]
        }, {
            test: /\.ts$/,
            use: 'awesome-typescript-loader'
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['public']),
        new ExtractTextPlugin({
            filename: './[name]/index.css',
            allChunks: true
        })
    ]
}];

module.exports = productionConfig;
