// @flow
import ReactDOM from 'react-dom';
import ExecutionEnvironment from 'exenv';
import is from 'is-lite';

export const { canUseDOM } = ExecutionEnvironment;
export const isReact16 = ReactDOM.createPortal !== undefined;

/**
 * Convert hex to RGB
 *
 * @param {string} hex
 * @returns {Array}
 */
export function hexToRGB(hex: string): ?Array<number> {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const properHex = hex.replace(shorthandRegex, (m, r, g, b) => (r + r + g + g + b + b));

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(properHex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ] : null;
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

  if (document.documentMode) {
    return 'ie';
  }

  if (/Edge/.test(navigator.userAgent)) {
    return 'edge';
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
  if (window.chrome) {
    return 'chrome';
  }

  // Safari (and Chrome iOS, Firefox iOS)
  if (/(Version\/([0-9._]+).*Safari|CriOS|FxiOS| Mobile\/)/.test(navigator.userAgent)) {
    return 'safari';
  }

  return navigator.userAgent;
}

export function getText(rootChild: any): string {
  let res = '';

  const recurse = (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      res += child;
    }
    else if (Array.isArray(child)) {
      child.forEach(c => recurse(c));
    }
    else if (child && child.props) {
      const { children } = child.props;

      if (Array.isArray(children)) {
        children.forEach(c => recurse(c));
      }
      else {
        recurse(children);
      }
    }
  };

  recurse(rootChild);

  return res;
}

export function hasKey(value: Object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

export function hasValidKeys(value: Object, keys: string | Array<any>): boolean {
  if (!is.plainObject(value) || !is.array(keys)) {
    return false;
  }
  let validKeys = keys;

  if (is.string(keys)) {
    validKeys = [keys];
  }

  return Object.keys(value).every(d => validKeys.includes(d));
}

export function hideBeacon(step: Object): boolean {
  return step.disableBeacon || step.placement === 'center';
}

export function isEqual(left: any, right: any): boolean {
  let t;
  const leftIsDOM = is.domElement(left);
  const rightIsDom = is.domElement(right);

  if (leftIsDOM && rightIsDom) {
    return left.isSameNode(right);
  }

  if ((leftIsDOM && !rightIsDom) || (!leftIsDOM && rightIsDom)) {
    return true;
  }

  for (const p in left) {
    if (Object.prototype.hasOwnProperty.call(left, p)) {
      if (typeof right[p] === 'undefined') {
        return false;
      }

      if (right[p] && !left[p]) {
        return false;
      }

      t = typeof left[p];

      if (t === 'object' && !isEqual(left[p], right[p])) {
        return false;
      }

      if (t === 'function' && (typeof right[p] === 'undefined' || left[p].toString() !== right[p].toString())) {
        return false;
      }

      if (left[p] !== right[p]) {
        return false;
      }
    }
  }

  for (const p in right) {
    if (Object.prototype.hasOwnProperty.call(right, p)) {
      if (typeof left[p] === 'undefined') {
        return false;
      }
    }
  }

  return true;
}

/**
 * Detect legacy browsers
 *
 * @returns {boolean}
 */
export function isLegacy(): boolean {
  return !['chrome', 'safari', 'firefox', 'opera'].includes(getBrowser());
}

export function isMobile(): boolean {
  return ('ontouchstart' in window) && /Mobi/.test(navigator.userAgent);
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

  if (debug) {
    if (title && data) {
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
    else {
      console.error('log', 'Missing title or data props');
    }
  }
  /* eslint-enable */
}
