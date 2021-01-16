const merge = require('webpack-merge')
const webpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const prodWebpackConfig = merge(webpackConfig, {
  mode: 'production',
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css'
    }),
    new CopyWebpackPlugin([
      {
        from: './mock/playlist.build.json',
        to: './mock/playlist.json',
        flatten: true
      },
      {
        from: './mock/*.jpg',
        to: './mock/',
        flatten: true
      },
      {
        from: './mock/*.mp3',
        to: './mock/',
        flatten: true
      }
    ])
  ]
})

module.exports = prodWebpackConfig