const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const ExtractPlugin = require('extract-text-webpack-plugin')
let config = merge(baseConfig, {
    entry: {
        app: path.join(__dirname, '../src/server-index.js')
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "entry-server.js",
        libraryTarget: "commonjs2"
    },
    target: "node", // 指定node运行环境
    module: {
        rules: [{
            test: /\.(scss|sass)$/,
            use: ExtractPlugin.extract({
                use: [
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    'sass-loader'
                ]
            })
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.REACT_ENV": JSON.stringify("server") // 指定React环境为服务端
        }),
        new ExtractPlugin('css/styles.[hash:8].css')
    ]
})

module.exports = config