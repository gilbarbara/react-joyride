/*eslint-disable no-var, func-names, prefer-arrow-callback, object-shorthand, no-console, prefer-template, vars-on-top */
var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var CleanPlugin = require('clean-webpack-plugin');
var autoprefixer = require('autoprefixer');

var webpackConfig = require('./webpack.config');

var config = merge.smart(webpackConfig, {
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
      options: {
        context: '/',
        postcss: function() {
          return {
            defaults: [autoprefixer],
            custom: [
              autoprefixer({
                browsers: [
                  'ie >= 9',
                  'ie_mob >= 10',
                  'ff >= 30',
                  'chrome >= 34',
                  'safari >= 7',
                  'opera >= 23',
                  'ios >= 7',
                  'android >= 4.4',
                  'bb >= 10',
                ],
              }),
            ],
          };
        },
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        screw_ie8: true,
        keep_fnames: false,
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
