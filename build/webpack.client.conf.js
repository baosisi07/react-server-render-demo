const isDev = process.env.NODE_ENV === 'development'
let config = isDev ? require('./webpack.dev.conf') : require('./webpack.prod.conf')
module.exports = config