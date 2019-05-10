const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')
const HTMLPlugin = require('html-webpack-plugin')
const devServer = {
  port: 8000,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  historyApiFallback: {
    index: '/index.html'
  },
  hot: true
}
let config = merge(baseConfig, {
  mode: 'development',
  devtool: '#cheap-module-eval-source-map',
  module: {
    rules: [{
      test: /\.(scss|sass)$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        },
        'sass-loader'
      ]
    }, ]
  },
  devServer,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HTMLPlugin({
      template: path.join(__dirname, '../index.html'),
      filename: 'index.html',
      favicon: 'public/favicon.ico'
    })
  ]
})

module.exports = config