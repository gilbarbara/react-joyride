/*eslint-disable  func-names, object-shorthand, prefer-template */
const path = require('path');
const webpack = require('webpack');
const ExtractText = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const isProd = process.env.NODE_ENV === 'production';
const cssLoaders = [
  'style',
  {
    loader: 'css',
    options: {
      sourceMap: true,
    },
  },
  {
    loader: 'postcss',
    options: {
      sourceMap: true,
      plugins: [
        autoprefixer(),
      ],
    },
  },
  {
    loader: 'sass',
    options: {
      sourceMap: true,
      outputStyle: 'compact',
    },
  },
];

const config = {
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
        loader: isProd ? ExtractText.extract({
          use: cssLoaders.slice(1),
        }) : cssLoaders,
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        use: [
          'file?hash=sha512&digest=hex' + (isProd ? '&name=media/[name].[ext]' : ''),
          {
            loader: 'image-webpack-loader',
            query: {
              optipng: {
                optimizationLevel: 5,
              },
              pngquant: {
                quality: '75-90',
              },
            },
          },
        ],
        include: /media/,
      },
    ],
  },
};

module.exports = config;
