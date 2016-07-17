/*eslint-disable no-console, no-var, no-unused-expressions */
var timer = 2500;
var wait = 1000;

describe('React Joyride', function mocha() {
  this.timeout(timer * 2);
  let session;

  it('should be able to init a session under 500ms', client => {
    session = client.url('http://localhost:8888/');
    session.resizeWindow(1280, 800);
    session.expect.element('#react').to.be.present.before(500);
  });

  it('should be able to see the component UI', () => {
    session.assert.elementPresent('.demo');
  });

  it('should be able to see the Joyride UI', () => {
    session.assert.elementPresent('.joyride');
  });

  context('Hero', () => {
    it('should be able to move the cursor the first tooltip"', () => {
      session.moveToElement('.hero h3 span', 0, 0, () => {});
      session.pause(timer);
    });

    it('should be able to see the tooltip UI', () => {
      session
        .waitForElementVisible('.joyride-tooltip', timer)
        .assert.cssProperty('.joyride-tooltip', 'top', '437px')
        .assert.cssProperty('.joyride-tooltip', 'left', '15px')
        .assert.cssProperty('.joyride-tooltip', 'width', '320px')
        .assert.cssProperty('.joyride-tooltip', 'height', '113px')
        .assert.containsText('.joyride-tooltip__header', 'The classic joyride')
        .assert.containsText('.joyride-tooltip__main', "Let's go on a magical tour");
    });

    it('should start the tour when clicking the button', () => {
      session.click('.hero h3 a');
      session.pause(timer);
    });
  });

  context('Projects', () => {
    it('should have scrolled to the element', () => {
      session.pause(wait);
      session.getLocation('.projects', (result) => {
        session.assert.equal(typeof result, 'object');
        session.assert.equal(result.status, 0);
        session.assert.equal(result.value.y, 728);
      });
    });

    it('should be able to see the beacon', () => {
      session
        .waitForElementVisible('.joyride-beacon', timer)
        .assert.cssProperty('.joyride-beacon', 'top', '754px')
        .assert.cssProperty('.joyride-beacon', 'left', '227px')
        .assert.cssProperty('.joyride-beacon', 'width', '36px')
        .assert.cssProperty('.joyride-beacon', 'height', '36px');
    });

    it('should be able to see the tooltip UI', () => {
      session
        .waitForElementVisible('.joyride-beacon', timer)
        .click('.joyride-beacon');

      session
        .waitForElementVisible('.joyride-tooltip', timer)
        .assert.cssProperty('.joyride-tooltip', 'top', '754px')
        .assert.cssProperty('.joyride-tooltip', 'left', '230px')
        .assert.cssProperty('.joyride-tooltip', 'width', '450px')
        .assert.cssProperty('.joyride-tooltip', 'height', '155px')
        .assert.containsText('.joyride-tooltip__header', 'Our Projects')
        .assert.containsText('.joyride-tooltip__main', 'Ooops. I forgot to add images!');
    });

    it('should be able to close the tooltip', () => {
      session.pause(wait);
      session.click('.joyride-tooltip__button--primary');
      session.waitForElementNotPresent('.joyride-tooltip', timer);
    });
  });

  context('Mission', () => {
    it('should have scrolled to the element', () => {
      session.pause(wait);
      session.getLocation('.mission', (result) => {
        session.assert.equal(typeof result, 'object');
        session.assert.equal(result.status, 0);
        session.assert.equal(result.value.y, 1456);
      });
    });

    it('should be able to see the beacon', () => {
      session
        .waitForElementVisible('.joyride-beacon', timer)
        .assert.cssProperty('.joyride-beacon', 'top', '1526px')
        .assert.cssProperty('.joyride-beacon', 'left', '129px')
        .assert.cssProperty('.joyride-beacon', 'width', '36px')
        .assert.cssProperty('.joyride-beacon', 'height', '36px');
    });

    it('should be able to see the tooltip UI', () => {
      session
        .waitForElementVisible('.joyride-beacon', timer)
        .click('.joyride-beacon');

      session
        .waitForElementVisible('.joyride-tooltip', timer)
        .assert.cssProperty('.joyride-tooltip', 'top', '1539px')
        .assert.cssProperty('.joyride-tooltip', 'left', '15px')
        .assert.cssProperty('.joyride-tooltip', 'width', '450px')
        .assert.cssProperty('.joyride-tooltip', 'height', '155px')
        .assert.containsText('.joyride-tooltip__header', 'Our Mission')
        .assert.containsText('.joyride-tooltip__main', 'Or some other marketing bullshit terms');
    });

    it('should be able to close the tooltip', () => {
      session.pause(wait);
      session.click('.joyride-tooltip__button--primary');
      session.waitForElementNotPresent('.joyride-tooltip', timer);
    });
  });

  context('About', () => {
    it('should have scrolled to the element', () => {
      session.pause(wait);
      session.getLocation('.about', (result) => {
        session.assert.equal(typeof result, 'object');
        session.assert.equal(result.status, 0);
        session.assert.equal(result.value.y, 2184);
      });
    });

    it('should be able to see the beacon', () => {
      session
        .waitForElementVisible('.joyride-beacon', timer)
        .assert.cssProperty('.joyride-beacon', 'top', '2210px')
        .assert.cssProperty('.joyride-beacon', 'left', '52px')
        .assert.cssProperty('.joyride-beacon', 'width', '36px')
        .assert.cssProperty('.joyride-beacon', 'height', '36px');
    });

    it('should be able to see the tooltip UI', () => {
      session
        .waitForElementVisible('.joyride-beacon', timer)
        .click('.joyride-beacon');

      session
        .waitForElementVisible('.joyride-tooltip', timer)
        .assert.cssProperty('.joyride-tooltip', 'top', '2040px')
        .assert.cssProperty('.joyride-tooltip', 'left', '15px')
        .assert.cssProperty('.joyride-tooltip', 'width', '450px')
        .assert.cssProperty('.joyride-tooltip', 'height', '155px')
        .assert.containsText('.joyride-tooltip__header', 'About Us')
        .assert.containsText('.joyride-tooltip__main', 'We are the people');
    });

    it('should be able to close the tooltip', () => {
      session.pause(wait);
      session.click('.joyride-tooltip__button--primary');
      session.waitForElementNotPresent('.joyride-tooltip', timer);
    });
  });

  after((client, done) => {
    client.end(() => {
      done();
    });
  });
});
