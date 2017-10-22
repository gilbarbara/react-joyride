/*eslint-disable func-names, object-shorthand */
const path = require('path');
const webpack = require('webpack');
const ExtractText = require('extract-text-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

const cssLoaders = [
  {
    loader: 'css',
    options: {
      sourceMap: true,
    },
  },
  {
    loader: 'postcss',
    options: {
      plugins: [
        autoprefixer({
          browsers: [
            'ie >= 10',
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 4.4',
            'bb >= 10'
          ],
        }),
      ],
      sourceMap: true,
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
        loader: ExtractText.extract(cssLoaders),
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
  ],
  watch: true,
};

module.exports = config;
