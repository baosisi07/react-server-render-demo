const path = require('path')
const webpack = require('webpack')
const isDev = process.env.NODE_ENV === 'development'
const config = {
  mode: process.env.NODE_ENV || 'production',
  target: 'web',
  entry:{
    app: path.join(__dirname, '../src/index.js')
  },
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js','jsx','json']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      },
      {
        test: /\.css$/,
        use: [
          'css-loader'
        ]
      },

      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name]-[hash:8].[ext]'
          }
        }]
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: 'resources/[name]-[hash:8].[ext]'
          }
        }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: isDev ? '"development"' : '"production"'
        }
      })
      
  ]
}

module.exports = config