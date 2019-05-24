const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const nodeExternals = require("webpack-node-externals");
const ExtractPlugin = require('extract-text-webpack-plugin')
const SSRServerPlugin = require("../plugin/webpack/server-plugin")
// const LoadablePlugin = require('@loadable/webpack-plugin')
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
    externals: [
        nodeExternals({
            whitelist: [/\.css$/] // 忽略css，让webpack处理
        })
    ],
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
            },
            {
                test: /\.(js|jsx)$/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        babelrc: false,
                        presets: [
                            "@babel/preset-react"
                        ],
                        plugins: [
                            "dynamic-import-node",
                            "@loadable/babel-plugin"
                        ]
                    }
                }],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.REACT_ENV": JSON.stringify("server") // 指定React环境为服务端
        }),
        new ExtractPlugin('css/styles.[hash:8].css'),
        new SSRServerPlugin({
            filename: "server.json"
        })
        // new LoadablePlugin({
        //     filename: "server.json"
        // })
    ]
})

module.exports = config