const merge = require('webpack-merge');

const webpackConfig = require('./webpack.prod');

const config = merge.smart(webpackConfig, {
  output: {
    publicPath: '/react-joyride',
  },
});

module.exports = config;
