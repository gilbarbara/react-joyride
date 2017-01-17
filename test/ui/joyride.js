/*eslint-disable no-console, no-var, no-unused-expressions no-console, func-names, prefer-arrow-callback, object-shorthand */
var sauce = require('../saucelabs');

var wait = 2500;
var pause = 1000;

module.exports = {
  after: function(browser) {
    console.log('Closing down...');
    sauce(browser, browser.end);
  },

  'should be able to init a session': function(browser) {
    browser
      .url('http://localhost:8888/')
      .maximizeWindow()
      .waitForElementVisible('#react', wait);
  },

  'should be able to see the demo UI': function(browser) {
    browser
      .assert.elementPresent('.demo__footer')
      .assert.elementPresent('.hero')
      .assert.elementPresent('.projects')
      .assert.elementPresent('.mission')
      .assert.elementPresent('.about');
  },

  'should be able to see the Joyride container': function(browser) {
    browser.assert.elementPresent('.joyride');
  },

  'Hero - should be able to show the standalone tooltip': function(browser) {
    browser
      .moveToElement('.hero__tooltip', 10, 10)
      .waitForElementVisible('.joyride-tooltip', wait)
      .assert.cssProperty('.joyride-tooltip', 'top', '437px')
      .assert.cssProperty('.joyride-tooltip', 'left', '339px')
      .assert.cssProperty('.joyride-tooltip', 'width', '290px')
      .assert.cssProperty('.joyride-tooltip', 'height', '137px')
      .assert.containsText('.joyride-tooltip__header', 'The classic joyride')
      .assert.containsText('.joyride-tooltip__main', "Let's go on a magical tour");
  },

  'Hero - should be able to hide the standalone tooltip': function(browser) {
    browser
      .moveToElement('.hero', 10, 10)
      .waitForElementNotPresent('.joyride-tooltip', wait);
  },

  'Hero - should start the tour when clicking the button': function(browser) {
    browser.click('.hero__start');
  },

  'Projects - should have scrolled to the element': function(browser) {
    browser
      .pause(pause)
      .getLocation('.projects', function(result) {
        browser.assert.equal(typeof result, 'object');
        browser.assert.equal(result.status, 0);
        browser.assert.equal(result.value.y, 861);
      });
  },

  'Projects - should be able to see the beacon': function(browser) {
    browser
      .waitForElementVisible('.joyride-beacon', wait)
      .assert.cssProperty('.joyride-beacon', 'top', '913px')
      .assert.cssProperty('.joyride-beacon', 'left', '622px')
      .assert.cssProperty('.joyride-beacon', 'width', '36px')
      .assert.cssProperty('.joyride-beacon', 'height', '36px');
  },

  'Projects - should be able to see the tooltip UI': function(browser) {
    browser
      .click('.joyride-beacon')
      .waitForElementVisible('.joyride-tooltip', wait)
      .assert.cssProperty('.joyride-tooltip', 'top', '737px')
      .assert.cssProperty('.joyride-tooltip', 'left', '415px')
      .assert.cssProperty('.joyride-tooltip', 'width', '450px')
      .assert.cssProperty('.joyride-tooltip', 'height', '161px')
      .assert.containsText('.joyride-tooltip__header', 'Title only steps — As they say: Make the font bigger!');
  },

  'Projects - should be able to close the tooltip': function(browser) {
    browser
      .pause(pause)
      .click('.joyride-tooltip__close')
      .waitForElementNotPresent('.joyride-tooltip', wait);
  },

  'Mission - should have scrolled to the element': function(browser) {
    browser
      .pause(pause)
      .getLocation('.mission', (result) => {
        browser.assert.equal(typeof result, 'object');
        browser.assert.equal(result.status, 0);
        browser.assert.equal(result.value.y, 1722);
      });
  },

  'Mission - should be able to see the beacon': function(browser) {
    browser
      .waitForElementVisible('.joyride-beacon', wait)
      .assert.cssProperty('.joyride-beacon', 'top', '1786px')
      .assert.cssProperty('.joyride-beacon', 'left', '217px')
      .assert.cssProperty('.joyride-beacon', 'width', '36px')
      .assert.cssProperty('.joyride-beacon', 'height', '36px');
  },

  'Mission - should be able to see the tooltip UI': function(browser) {
    browser
      .click('.joyride-beacon')
      .waitForElementVisible('.joyride-tooltip', wait)
      .assert.cssProperty('.joyride-tooltip', 'top', '1799px')
      .assert.cssProperty('.joyride-tooltip', 'left', '15px')
      .assert.cssProperty('.joyride-tooltip', 'width', '450px')
      .assert.cssProperty('.joyride-tooltip', 'height', '179px')
      .assert.containsText('.joyride-tooltip__header', 'Our Mission')
      .assert
      .containsText('.joyride-tooltip__main', 'Can be advanced by clicking an element through the overlay hole.');
  },

  "Mission - should be able to advance the tour by clicking the step's target button": function(browser) {
    browser
      .moveToElement('.mission button', 10, 10)
      .click('.mission button');
  },

  'About - should have scrolled to the element': function(browser) {
    browser
      .pause(pause)
      .getLocation('.about', function(result) {
        browser.assert.equal(typeof result, 'object');
        browser.assert.equal(result.status, 0);
        browser.assert.equal(result.value.y, 2583);
      });
  },

  'About - should be able to see the tooltip UI': function(browser) {
    browser
      .pause(pause)
      .waitForElementVisible('.joyride-tooltip', wait)
      .assert.cssProperty('.joyride-tooltip', 'top', '2423px')
      .assert.cssProperty('.joyride-tooltip', 'left', '15px')
      .assert.cssProperty('.joyride-tooltip', 'width', '450px')
      .assert.cssProperty('.joyride-tooltip', 'height', '155px')
      .assert.containsText('.joyride-tooltip__header', 'About Us')
      .assert.containsText('.joyride-tooltip__main', 'We are the people');
  },

  'About - should be able to close the tooltip': function(browser) {
    browser
      .pause(pause)
      .click('.joyride-tooltip__button--primary');
  },

  'Footer - should be able to see the tooltip UI': function(browser) {
    browser
      .pause(pause)
      .waitForElementVisible('.joyride-tooltip', wait)
      .assert.cssProperty('.joyride-tooltip', 'position', 'fixed')
      .assert.cssProperty('.joyride-tooltip', 'top', '656px')
      .assert.cssProperty('.joyride-tooltip', 'left', '15px')
      .assert.cssProperty('.joyride-tooltip', 'width', '450px')
      .assert.cssProperty('.joyride-tooltip', 'height', '130px')
      .assert.containsText('.joyride-tooltip__main', "Text only steps — Because sometimes you don't really need a proper heading");
  },

  'Footer - should be able to close the tooltip': function(browser) {
    browser
      .pause(pause)
      .click('.joyride-tooltip__button--primary')
      .waitForElementNotPresent('.joyride-tooltip', wait);
  },

  'Footer - should be able to show the standalone tooltip': function(browser) {
    browser
      .pause(pause)
      .moveToElement('.demo__footer img', 10, 10)
      .waitForElementVisible('.joyride-tooltip', wait)
      .assert.cssProperty('.joyride-tooltip', 'position', 'fixed')
      .assert.cssProperty('.joyride-tooltip', 'top', '665px')
      .assert.cssProperty('.joyride-tooltip', 'left', '495px')
      .assert.cssProperty('.joyride-tooltip', 'width', '290px')
      .assert.cssProperty('.joyride-tooltip', 'height', '113px')
      .assert.containsText('.joyride-tooltip__header', 'A fixed tooltip')
      .assert.containsText('.joyride-tooltip__main', 'For fixed elements, you know?');
  },

  'Footer - should be able to hide the standalone tooltip': function(browser) {
    browser
      .moveToElement('.hero', 10, 10)
      .waitForElementNotPresent('.joyride-tooltip', wait);
  },
};
