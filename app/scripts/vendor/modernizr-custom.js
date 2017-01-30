import Modernizr from 'modernizr';

const BrowserDetect = {
  init() {
    this.browser = this.searchString(this.dataBrowser) || 'Other';
    this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'Unknown';
  },
  searchString(data) {
    for (let i = 0; i < data.length; i++) {
      const dataString = data[i].string;
      this.versionSearchString = data[i].subString;

      if (dataString.indexOf(data[i].subString) !== -1) {
        return data[i].identity;
      }
    }

    return '';
  },
  searchVersion(dataString) {
    const index = dataString.indexOf(this.versionSearchString);
    if (index === -1) {
      return '';
    }

    const rv = dataString.indexOf('rv:');
    if (this.versionSearchString === 'Trident' && rv !== -1) {
      return parseFloat(dataString.substring(rv + 3));
    }

    return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
  },

  dataBrowser: [
    { string: navigator.userAgent, subString: 'Edge', identity: 'MS Edge' },
    { string: navigator.userAgent, subString: 'MSIE', identity: 'Explorer' },
    { string: navigator.userAgent, subString: 'Trident', identity: 'Explorer' },
    { string: navigator.userAgent, subString: 'Firefox', identity: 'Firefox' },
    { string: navigator.userAgent, subString: 'Opera', identity: 'Opera' },
    { string: navigator.userAgent, subString: 'OPR', identity: 'Opera' },
    { string: navigator.userAgent, subString: 'Chrome', identity: 'Chrome' },
    { string: navigator.userAgent, subString: 'Safari', identity: 'Safari' },
  ],
};

BrowserDetect.init();

Modernizr.addTest('ipad', Boolean(navigator.userAgent.match(/iPad/i)));

Modernizr.addTest('iphone', Boolean(navigator.userAgent.match(/iPhone/i)));

Modernizr.addTest('ipod', Boolean(navigator.userAgent.match(/iPod/i)));

Modernizr.addTest('ios', (Modernizr.ipad || Modernizr.ipod || Modernizr.iphone));

Modernizr.addTest('ie', Boolean(BrowserDetect.browser === 'Explorer'));

require('expose?MobileDetect!mobile-detect');
require('mobile-detect/mobile-detect-modernizr');
