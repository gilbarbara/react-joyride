/*eslint-disable no-var, one-var, func-names, indent, prefer-arrow-callback, object-shorthand, no-console, newline-per-chained-call, one-var-declaration-per-line, prefer-template, vars-on-top */
var path = require('path');
var webpack = require('webpack');
var ExtractText = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

var isProd = process.env.NODE_ENV === 'production';
var cssLoaders = ['css?sourceMap', 'postcss?pack=custom', 'sass?sourceMap'];

var config = {
  context: path.join(__dirname, '../'),
  resolve: {
    modules: [path.join(__dirname, '../../src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  entry: {},
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, '../../dist'),
    publicPath: '/',
  },
  devtool: '#inline-source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
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
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel?cacheDirectory'],
        include: [
          path.join(__dirname, '../../src'),
          path.join(__dirname, '../'),
        ],
      },
      {
        test: /\.scss$/,
        loader: isProd ? ExtractText.extract(cssLoaders.join('!')) : ['style'].concat(cssLoaders).join('!'),
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        use: [
          'file?hash=sha512&digest=hex' + (isProd ? '&name=media/[name].[ext]' : ''),
          'image-webpack?bypassOnDebug=false&optimizationLevel=7&interlaced=false',
        ],
        include: /media/,
      },
    ],
  },
};

module.exports = config;
