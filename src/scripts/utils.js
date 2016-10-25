/*eslint-disable no-nested-ternary */

/**
 * Convert hex to RGB
 *
 * @param {string} hex
 * @returns {Object}
 */
export function hexToRGB(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const newHex = hex.replace(shorthandRegex, (m, r, g, b) => (r + r + g + g + b + b));

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Get the current browser
 *
 * @returns {String}
 */
function getBrowser() {
  if (typeof window === 'undefined') {
    return 'node';
  }

  // Opera 8.0+
  const isOpera = Boolean(window.opera) || navigator.userAgent.indexOf(' OPR/') >= 0;
  // Firefox 1.0+
  const isFirefox = typeof InstallTrigger !== 'undefined';
  // Chrome 1+
  const isChrome = !!window.chrome && !!window.chrome.webstore;
  // Safari <= 9 "[object HTMLElementConstructor]"
  const isSafari = (Object.prototype.toString.call(window.HTMLElement)
      .indexOf('Constructor') > 0 || !isChrome) && !isOpera && window.webkitAudioContext !== undefined;
  // Internet Explorer 6-11
  const isIE = Boolean(document.documentMode); // At least IE6

  return isOpera ? 'opera' :
         isFirefox ? 'firefox' :
         isChrome ? 'chrome' :
         isSafari ? 'safari' :
         isIE ? 'ie' :
         '';
}

export const browser = getBrowser();

/**
 * Get DOM document root element
 * @returns {Element}
 */
export function getRootEl() {
  return ['ie', 'firefox'].indexOf(getBrowser()) > -1 ? document.documentElement : document.body;
}
