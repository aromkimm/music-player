const merge = require('webpack-merge')
const webpack = require('webpack')
const webpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const devWebpackConfig = merge(webpackConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    host: 'localhost',
    port: 9001,
    stats: {
      color: true
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
})

module.exports = devWebpackConfig