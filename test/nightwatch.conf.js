/*eslint-disable no-var */
var jar = require('selenium-server-standalone-jar');
var chromedriver = require('chromedriver');

module.exports = {
  src_folders: ['test'],
  output_folder: 'reports',
  selenium: {
    start_process: true,
    server_path: jar.path,
    cli_args: {
      'webdriver.chrome.driver': chromedriver.path,
      'webdriver.ie.driver': ''
    }
  },
  test_runner: { type: 'mocha', options: { bail: true } },
  test_settings: {
    default: {
      launch_url: 'http://localhost',
      filter: 'test/*.nightwatch.js',
      screenshots: {
        enabled: false,
        path: 'reports'
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    }
  }
};
