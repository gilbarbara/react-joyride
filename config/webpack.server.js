/*eslint-disable func-names, prefer-arrow-callback, object-shorthand, no-console,prefer-template */
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const merge = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const dateFns = require('date-fns');

const webpackConfig = require('./webpack.config');

const config = merge.smart(webpackConfig, {
  cache: true,
  entry: {
    bundle: [
      'webpack-dev-server/client?http://localhost:3030',
      'webpack/hot/only-dev-server',
      'core-js/modules/es6.symbol',
      'react-hot-loader/patch',
      './scripts/index.jsx',
    ],
    modernizr: './scripts/vendor/modernizr-custom.js',
  },
  output: {
    filename: '[name].js',
    publicPath: 'http://localhost:3000/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      notify: true,
      logPrefix: 'joyride',
      proxy: 'http://localhost:3030',
    }, {
      reload: false,
    }),
  ],
  performance: {
    hints: false,
  },
});

const compiler = webpack(config);
let start;

compiler.plugin('compile', function() {
  start = new Date();
  console.log(dateFns.format(start, 'hh:mm:ss') + ' Bundling...');
});

compiler.plugin('emit', function(compilation, callback) {
  const now = new Date();
  console.log('Duration: ' + dateFns.differenceInSeconds(now, start) + 's');
  console.log('Hash: ' + compilation.hash);
  callback();
});

new WebpackDevServer(compiler, {
  contentBase: path.join(__dirname, '../assets'),
  noInfo: true,
  hot: true,
  historyApiFallback: true,
  stats: { colors: true },
}).listen(3030, 'localhost', function(err) {
  if (err) {
    console.log('err', err);
  }
});
