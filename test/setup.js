import { jsdom } from 'jsdom';

const doc = jsdom('<html><body><div id="react"></div></body></html>', {
  features: {
    QuerySelector: true
  }
});
const win = doc.defaultView;

global.document = doc;
global.window = win;
global.window.matchMedia = () => ({ matches: true });
global.navigator = { userAgent: 'node.js' };

/**
 * Convert data-attr into key data-foo-bar -> fooBar
 *
 * @param {string} val
 * @returns {string}
 */
function attrToDataKey(val) {
  const out = val.substr(5);
  return out.split('-').map((part, inx) => {
    if (!inx) {
      return part;
    }
    return part.charAt(0).toUpperCase() + part.substr(1);
  }).join('');
}

/**
 * Produce dataset object emulating behavior of el.dataset
 *
 * @param {Element} el
 * @returns {Object}
 */
function getNodeDataAttrs(el) {
  const atts = el.attributes;
  const len = atts.length;
  const datasetMap = [];
  // represents el.dataset
  const proxy = {};

  for (let i = 0; i < len; i++) {
    const attr = atts[i].nodeName;

    if (attr.indexOf('data-') === 0) {
      const datakey = attrToDataKey(attr);
      if (typeof datasetMap[datakey] !== 'undefined') {
        break;
      }
      datasetMap[datakey] = atts[i].nodeValue;
      (function(data) { //eslint-disable-line no-loop-func, func-names
        // every data-attr found on the element makes a getter and setter
        Object.defineProperty(proxy, data, {
          enumerable: true,
          configurable: true,
          get: () => datasetMap[data],
          set: (val) => {
            datasetMap[datakey] = val;
            el.setAttribute(attr, val);
          }
        });
      }(datakey));
    }
  }
  return proxy;
}

Object.defineProperty(global.window.Element.prototype, 'dataset', {
  get: () => getNodeDataAttrs(this)
});

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal(window) {
  for (const key in window) { //eslint-disable-line no-restricted-syntax
    if (!window.hasOwnProperty(key)) {
      continue;
    }
    if (key in global) {
      continue;
    }

    global[key] = window[key];
  }
}

propagateToGlobal(win);
