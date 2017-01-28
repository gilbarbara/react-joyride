/*eslint-disable no-var, one-var, func-names, indent, prefer-arrow-callback, object-shorthand, no-console, newline-per-chained-call, one-var-declaration-per-line, prefer-template, vars-on-top */
var path = require('path');
var webpack = require('webpack');
var ExtractText = require('extract-text-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');
var autoprefixer = require('autoprefixer');

var config = {
  context: path.join(__dirname, '../src'),
  resolve: {
    alias: {
      test: path.join(__dirname, '../test'),
    },
    modules: [path.join(__dirname, '../src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  entry: path.join(__dirname, '../src', 'scripts', 'Joyride.jsx'),
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '../lib'),
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel?cacheDirectory'],
        include: [
          path.join(__dirname, '../src'),
          path.join(__dirname, '../test'),
        ],
      },
      {
        test: /\.scss$/,
        loader: ExtractText.extract(['css?sourceMap', 'postcss?pack=custom', 'sass?sourceMap'].join('!')),
      },
      {
        test: /\.json$/,
        use: ['json'],
      },
    ],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractText('react-joyride-compiled.css'),
    new CopyPlugin([
      { from: 'styles/react-joyride.scss' },
    ]),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: '/',
        postcss: function() {
          return {
            defaults: [autoprefixer],
            custom: [
              autoprefixer({
                browsers: [
                  'ie >= 11',
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
  ],
  watch: true,
};

module.exports = config;
