/*eslint-disable no-console, no-var, no-unused-expressions no-console, func-names, prefer-arrow-callback, object-shorthand */
var sauce = require('../saucelabs');

var timer = 2500;
var wait = 1000;

module.exports = {
  after: function(browser) {
    console.log('Closing down...');
    sauce(browser, browser.end);
  },

  'should be able to init a session': function(browser) {
    browser
      .url('http://localhost:8888/')
      .resizeWindow(1280, 800)
      .waitForElementVisible('#react', timer);
  },

  'should be able to see the component UI': function(browser) {
    browser
      .assert.elementPresent('.demo');
  },

  'should be able to see the Joyride UI': function(browser) {
    browser.assert.elementPresent('.joyride');
  },

  'Hero - should be able to move the cursor the first tooltip': function(browser) {
    browser.moveToElement('.hero h3 span', 0, 0, function() {});
    browser.pause(timer);
  },

  'Hero - should be able to see the tooltip UI': function(browser) {
    browser
      .waitForElementVisible('.joyride-tooltip', timer)
      .assert.cssProperty('.joyride-tooltip', 'top', '437px')
      .assert.cssProperty('.joyride-tooltip', 'left', '15px')
      .assert.cssProperty('.joyride-tooltip', 'width', '320px')
      .assert.cssProperty('.joyride-tooltip', 'height', '113px')
      .assert.containsText('.joyride-tooltip__header', 'The classic joyride')
      .assert.containsText('.joyride-tooltip__main', "Let's go on a magical tour");
  },

  'Hero - should start the tour when clicking the button': function(browser) {
    browser.click('.hero h3 a');
    browser.pause(timer);
  },

  'Projects - should have scrolled to the element': function(browser) {
    browser.pause(wait);
    browser.getLocation('.projects', function(result) {
      browser.assert.equal(typeof result, 'object');
      browser.assert.equal(result.status, 0);
      browser.assert.equal(result.value.y, 728);
    });
  },

  'Projects - should be able to see the beacon': function(browser) {
    browser
      .waitForElementVisible('.joyride-beacon', timer)
      .assert.cssProperty('.joyride-beacon', 'top', '754px')
      .assert.cssProperty('.joyride-beacon', 'left', '227px')
      .assert.cssProperty('.joyride-beacon', 'width', '36px')
      .assert.cssProperty('.joyride-beacon', 'height', '36px');
  },

  'Projects - should be able to see the tooltip UI': function(browser) {
    browser
      .waitForElementVisible('.joyride-beacon', timer)
      .click('.joyride-beacon');

    browser
      .waitForElementVisible('.joyride-tooltip', timer)
      .assert.cssProperty('.joyride-tooltip', 'top', '754px')
      .assert.cssProperty('.joyride-tooltip', 'left', '230px')
      .assert.cssProperty('.joyride-tooltip', 'width', '450px')
      .assert.cssProperty('.joyride-tooltip', 'height', '155px')
      .assert.containsText('.joyride-tooltip__header', 'Our Projects')
      .assert.containsText('.joyride-tooltip__main', 'Ooops. I forgot to add images!');
  },

  'Projects - should be able to close the tooltip': function(browser) {
    browser.pause(wait);
    browser.click('.joyride-tooltip__button--primary');
    browser.waitForElementNotPresent('.joyride-tooltip', timer);
  },

  'Mission - should have scrolled to the element': function(browser) {
    browser.pause(wait);
    browser.getLocation('.mission', (result) => {
      browser.assert.equal(typeof result, 'object');
      browser.assert.equal(result.status, 0);
      browser.assert.equal(result.value.y, 1456);
    });
  },

  'Mission - should be able to see the beacon': function(browser) {
    browser
      .waitForElementVisible('.joyride-beacon', timer)
      .assert.cssProperty('.joyride-beacon', 'top', '1526px')
      .assert.cssProperty('.joyride-beacon', 'left', '129px')
      .assert.cssProperty('.joyride-beacon', 'width', '36px')
      .assert.cssProperty('.joyride-beacon', 'height', '36px');
  },

  'Mission - should be able to see the tooltip UI': function(browser) {
    browser
      .waitForElementVisible('.joyride-beacon', timer)
      .click('.joyride-beacon');

    browser
      .waitForElementVisible('.joyride-tooltip', timer)
      .assert.cssProperty('.joyride-tooltip', 'top', '1539px')
      .assert.cssProperty('.joyride-tooltip', 'left', '15px')
      .assert.cssProperty('.joyride-tooltip', 'width', '450px')
      .assert.cssProperty('.joyride-tooltip', 'height', '155px')
      .assert.containsText('.joyride-tooltip__header', 'Our Mission')
      .assert.containsText('.joyride-tooltip__main', 'Or some other marketing bullshit terms');
  },

  'Mission - should be able to close the tooltip': function(browser) {
    browser.pause(wait);
    browser.click('.joyride-tooltip__button--primary');
    browser.waitForElementNotPresent('.joyride-tooltip', timer);
  },

  'About - should have scrolled to the element': function(browser) {
    browser.pause(wait);
    browser.getLocation('.about', function(result) {
      browser.assert.equal(typeof result, 'object');
      browser.assert.equal(result.status, 0);
      browser.assert.equal(result.value.y, 2184);
    });
  },

  'About - should be able to see the beacon': function(browser) {
    browser
      .waitForElementVisible('.joyride-beacon', timer)
      .assert.cssProperty('.joyride-beacon', 'top', '2210px')
      .assert.cssProperty('.joyride-beacon', 'left', '52px')
      .assert.cssProperty('.joyride-beacon', 'width', '36px')
      .assert.cssProperty('.joyride-beacon', 'height', '36px');
  },

  'About - should be able to see the tooltip UI': function(browser) {
    browser
      .waitForElementVisible('.joyride-beacon', timer)
      .click('.joyride-beacon');

    browser
      .waitForElementVisible('.joyride-tooltip', timer)
      .assert.cssProperty('.joyride-tooltip', 'top', '2040px')
      .assert.cssProperty('.joyride-tooltip', 'left', '15px')
      .assert.cssProperty('.joyride-tooltip', 'width', '450px')
      .assert.cssProperty('.joyride-tooltip', 'height', '155px')
      .assert.containsText('.joyride-tooltip__header', 'About Us')
      .assert.containsText('.joyride-tooltip__main', 'We are the people');
  },

  'About - should be able to close the tooltip': function(browser) {
    browser.pause(wait);
    browser.click('.joyride-tooltip__button--primary');
    browser.waitForElementNotPresent('.joyride-tooltip', timer);
  },
};
