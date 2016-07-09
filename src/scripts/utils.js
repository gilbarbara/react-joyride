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
  const isOpera = Boolean(window.opera) || navigator.userAgent.indexOf(' OPR/') >= 0;
  // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
  const isFirefox = typeof InstallTrigger !== 'undefined';// Firefox 1.0+
  const isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
  // At least Safari 3+: "[object HTMLElementConstructor]"
  const isChrome = Boolean(window.chrome) && !isOpera;// Chrome 1+
  const isIE = Boolean(document.documentMode); // At least IE6

  return isOpera ? 'opera' :
         isFirefox ? 'firefox' :
         isSafari ? 'safari' :
         isChrome ? 'chrome' :
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
