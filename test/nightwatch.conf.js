/*eslint-disable no-var */
var selenium = require('selenium-server-standalone-jar');
var chromedriver = require('chromedriver');

const TRAVIS_JOB_NUMBER = process.env.TRAVIS_JOB_NUMBER;

module.exports = {
  src_folders: ['test/ui'],
  output_folder: 'reports',
  selenium: {
    start_process: false,
    server_path: selenium.path,
    cli_args: {
      'webdriver.chrome.driver': chromedriver.path,
      'webdriver.ie.driver': ''
    }
  },
  test_settings: {
    default: {
      launch_url: 'http://ondemand.saucelabs.com:80',
      selenium_host: 'ondemand.saucelabs.com',
      selenium_port: 80,
      username: process.env.SAUCE_USERNAME,
      access_key: process.env.SAUCE_ACCESS_KEY,
      screenshots: {
        enabled: false,
        path: 'reports'
      },
      desiredCapabilities: {
        browserName: 'chrome',
        platform: 'OS X 10.11',
        version: '51.0',
        build: `build-${TRAVIS_JOB_NUMBER}`,
        'tunnel-identifier': TRAVIS_JOB_NUMBER,
        screenResolution: '1280x960'
      },
    },
    local: {
      launch_url: 'http://localhost',
      selenium_host: 'localhost',
      selenium_port: 4444,
      silent: true,
      screenshots: {
        enabled: false,
        path: 'reports'
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true
      },
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
