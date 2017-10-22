/*eslint-disable no-var, func-names, prefer-arrow-callback, object-shorthand, no-console, prefer-template, vars-on-top */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');

const webpackConfig = require('./webpack.config');

const config = merge.smart(webpackConfig, {
  entry: {
    index: path.join(__dirname, '../src', 'scripts', 'Joyride.jsx'),
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '../lib'),
  },
  devtool: 'source-map',
  plugins: [
    new CleanPlugin(['lib'], { root: path.join(__dirname, '../') }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        screw_ie8: true,
        keep_fnames: true,
      },
      compress: {
        booleans: true,
        conditionals: true,
        dead_code: true, // big one--strip code that will never execute
        evaluate: true,
        screw_ie8: true,
        unused: true,
        warnings: false, // good for prod apps so users can't peek behind curtain
      },
      comments: false,
      sourceMap: true,
    }),
  ],
  watch: false,
});

module.exports = config;
