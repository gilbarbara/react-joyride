// @flow
import ReactDOM from 'react-dom';
import ExecutionEnvironment from 'exenv';
import is from '@sindresorhus/is';

export const { canUseDOM } = ExecutionEnvironment;
export const isReact16 = ReactDOM.createPortal !== undefined;

export function isMobile(): boolean {
  return ('ontouchstart' in window) && /Mobi/.test(navigator.userAgent);
}

/**
 * Convert hex to RGB
 *
 * @param {string} hex
 * @returns {Object}
 */
export function hexToRGB(hex: string): ?Object {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const newHex = hex.replace(shorthandRegex, (m, r, g, b) => (r + r + g + g + b + b));

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * Get the current browser
 *
 * @returns {String}
 */
export function getBrowser(): string {
  /* istanbul ignore if */
  if (typeof window === 'undefined') {
    return 'node';
  }

  // Opera 8.0+
  if (Boolean(window.opera) || navigator.userAgent.indexOf(' OPR/') >= 0) {
    return 'opera';
  }
  // Firefox 1.0+
  if (typeof window.InstallTrigger !== 'undefined') {
    return 'firefox';
  }
  // Chrome 1+
  if (!!window.chrome && !!window.chrome.webstore) {
    return 'chrome';
  }

  if (/Version\/([0-9._]+).*Safari/.test(navigator.userAgent)) {
    return 'safari';
  }

  if (document.documentMode) {
    return 'ie';
  }

  return navigator.userAgent;
}

/**
 * Detect legacy browsers
 *
 * @returns {boolean}
 */
export function isLegacy(): boolean {
  return !['chrome', 'safari', 'firefox', 'opera'].includes(getBrowser());
}

/**
 * Log method calls if debug is enabled
 *
 * @private
 * @param {Object}       arg
 * @param {string}       arg.title    - The title the logger was called from
 * @param {Object|Array} [arg.data]   - The data to be logged
 * @param {boolean}      [arg.warn]  - If true, the message will be a warning
 * @param {boolean}      [arg.debug] - Nothing will be logged unless debug is true
 */
export function log({ title, data, warn = false, debug = false }: Object) {
  /* eslint-disable no-console */
  const logFn = warn ? console.warn || console.error : console.log;

  if (debug && title && data) {
    console.groupCollapsed(`%creact-joyride: ${title}`, 'color: #ff0044; font-weight: bold; font-size: 12px;');

    if (Array.isArray(data)) {
      data.forEach(d => {
        if (is.plainObject(d) && d.key) {
          logFn.apply(console, [d.key, d.value]);
        }
        else {
          logFn.apply(console, [d]);
        }
      });
    }
    else {
      logFn.apply(console, [data]);
    }

    console.groupEnd();
  }
  /* eslint-enable */
}

export function hasKey(value: Object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

export function hasValidKeys(value: Object, keys: string | Array<any>): boolean {
  if (!is.plainObject(value) || !is.array(keys)) return false;
  let validKeys = keys;

  if (is.string(keys)) {
    validKeys = [keys];
  }

  return Object.keys(value).every(d => validKeys.includes(d));
}
