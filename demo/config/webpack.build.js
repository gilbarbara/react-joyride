/*eslint-disable no-var, one-var, func-names, indent, prefer-arrow-callback, object-shorthand, no-console, newline-per-chained-call, one-var-declaration-per-line, prefer-template, vars-on-top */
var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var autoprefixer = require('autoprefixer');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractText = require('extract-text-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');

var webpackConfig = require('./webpack.config');
var NPMPackage = require('../../package');

var config = merge.smart(webpackConfig, {
  entry: {
    demo: './index.jsx',
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, '../../dist'),
  },
  devtool: 'source-map',
  plugins: [
    new CleanPlugin(['dist'], { root: path.join(__dirname, '../../') }),
    new ExtractText('demo.[hash].css'),
    new HtmlPlugin({
      inject: false,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      mobile: true,
      template: './assets/index.ejs',
      title: NPMPackage.title,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
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
      sourceMap: true,
    }),
  ],
});

module.exports = config;
