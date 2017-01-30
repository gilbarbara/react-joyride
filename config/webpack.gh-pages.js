/*eslint-disable no-var, func-names, prefer-arrow-callback, object-shorthand, no-console, prefer-template, vars-on-top */
var merge = require('webpack-merge');

var webpackConfig = require('./webpack.prod');

var config = merge.smart(webpackConfig, {
  output: {
    publicPath: '/react-joyride',
  },
});

module.exports = config;
