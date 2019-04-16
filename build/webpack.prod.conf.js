const path = require('path')
const merge = require('webpack-merge')
const ExtractPlugin = require('extract-text-webpack-plugin')
const baseConfig = require('./webpack.base.conf')
const HTMLPlugin = require('html-webpack-plugin')
let config = merge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../src/index.js')
  },
  output: {
    filename: 'js/[name].[chunkhash:8].js'
  },
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
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true
  },
  plugins: [
    new ExtractPlugin('css/styles.[hash:8].css'),
    new HTMLPlugin({
      template: path.join(__dirname, '../index.html'),
      filename: 'index.html'
    })
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor'
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'runtime'
    // })
  ]
})

module.exports = config