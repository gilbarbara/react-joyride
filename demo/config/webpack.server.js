/*eslint-disable func-names, prefer-arrow-callback, object-shorthand, prefer-template, no-console */
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const merge = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const dateFns = require('date-fns');
const webpackConfig = require('./webpack.config');

const args = process.argv.slice(2);

function getIPAddress() {
  const interfaces = require('os').networkInterfaces();

  for (const devName in interfaces) {
    if ({}.hasOwnProperty.call(interfaces, devName)) {
      const iface = interfaces[devName];

      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
  }

  return '0.0.0.0';
}

let envPlugin;

if (args[0] && args[0] === 'test:ui') {
  envPlugin = new webpack.DefinePlugin({
    NIGHTWATCH: JSON.stringify(true),
  });
}
else {
  envPlugin = new BrowserSyncPlugin({
    host: getIPAddress(),
    port: 3000,
    notify: true,
    logPrefix: 'sia',
    proxy: 'http://localhost:3030',
  }, {
    reload: false,
  });
}

const config = merge.smart(webpackConfig, {
  cache: true,
  entry: {
    bundle: [
      'webpack-dev-server/client?http://localhost:3030',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      './index.jsx',
    ],
  },
  output: {
    filename: '[name].js',
    publicPath: 'http://localhost:3000/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    envPlugin,
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

  if (args[0] && args[0] === 'test:ui') {
    spawnSync('pkill', ['-f', 'selenium']);

    const nightwatch = spawn(path.join(__dirname, '../../node_modules/.bin/nightwatch'), [
      '-c',
      path.join(__dirname, '../../test/__setup__/nightwatch.conf.js')
    ]);

    nightwatch.stdout.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    nightwatch.stderr.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    nightwatch.on('close', () => {
      process.exit(0);
    });
  }

  callback();
});

new WebpackDevServer(compiler, {
  contentBase: path.join(__dirname, '../'),
  noInfo: true,
  hot: true,
  historyApiFallback: true,
  stats: { colors: true },
}).listen(3030, 'localhost', function(err) {
  if (err) {
    console.log('err', err);
  }
});
