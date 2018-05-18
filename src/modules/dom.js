// @flow
import scroll from 'scroll';
import scrollDoc from 'scroll-doc';
import getScrollParent from 'scrollparent';

export { getScrollParent };

/**
 * Find the bounding client rect
 *
 * @private
 * @param {HTMLElement} element - The target element
 * @returns {Object}
 */
export function getClientRect(element: HTMLElement): Object {
  if (!element) {
    return {};
  }

  return element.getBoundingClientRect();
}

/**
 * Helper function to get the browser-normalized "document height"
 * @returns {Number}
 */
export function getDocumentHeight(): number {
  const { body, documentElement: html } = document;

  if (!body || !html) {
    return 0;
  }

  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

/**
 * Find the bounding client rect relative to the parent
 *
 * @private
 * @param {HTMLElement} element - The target element
 * @param {HTMLElement} [parent] - The parent element to calculate offsets from
 * @returns {Object}
 */
export function getRelativeClientRect(element: HTMLElement, parent: HTMLElement): Object {
  const elementRect = getClientRect(element);

  if (!parent || parent.style.position) {
    return elementRect;
  }

  const parentRect = getClientRect(parent);
  const offsetTop = (elementRect.top - parentRect.top) + parent.scrollTop;
  const offsetLeft = (elementRect.left - parentRect.left) + parent.scrollLeft;

  return {
    top: offsetTop,
    left: offsetLeft,
    right: parentRect.right > 0 ? parentRect.right - elementRect.right : elementRect.right,
    bottom: parentRect.bottom > 0 ? parentRect.bottom - elementRect.bottom : elementRect.bottom,
    x: offsetLeft,
    y: offsetTop,
    width: elementRect.width,
    height: elementRect.height,
  };
}

export function getStyleComputedProperty(el: HTMLElement): Object {
  if (!el || el.nodeType !== 1) {
    return {};
  }

  return getComputedStyle(el);
}

export function hasCustomScrollParent(element: ?HTMLElement): boolean {
  if (!element) {
    return false;
  }
  return getScrollParent(element) !== scrollDoc();
}

export function hasCustomOffsetParent(element: HTMLElement): boolean {
  return element.offsetParent !== document.body;
}

export function isFixed(el: ?HTMLElement | Node): boolean {
  if (!el || !(el instanceof HTMLElement)) {
    return false;
  }

  const { nodeName } = el;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }

  if (getStyleComputedProperty(el).position === 'fixed') {
    return true;
  }

  return isFixed(el.parentNode);
}

/**
 * Get the scroll position
 *
 * @param {HTMLElement} element
 * @param {number} offset
 * @param {string} axis
 *
 * @returns {number}
 */
export function getScrollTo(element: HTMLElement, offset: number, axis: string = 'y'): number {
  if (!element) {
    return 0;
  }

  const parent = getScrollParent(element);
  const scrollKey = axis === 'y' ? 'scrollTop' : 'scrollLeft';
  const offsetKey = axis === 'y' ? 'top' : 'left';
  const parentPos = parent.getBoundingClientRect()[offsetKey];
  const elementOffset = element.getBoundingClientRect()[offsetKey];
  let scrollToPos = (parent[scrollKey] + elementOffset) - parentPos;

  if (hasCustomScrollParent(element) && !hasCustomOffsetParent(element)) {
    scrollToPos -= parentPos;
  }

  return scrollToPos > offset ? Math.floor(scrollToPos - offset) : scrollToPos;
}

/**
 * Find and return the target DOM element based on a step's 'target'.
 *
 * @private
 * @param {string|HTMLElement} element
 *
 * @returns {HTMLElement|undefined}
 */
export function getElement(element: string | HTMLElement): ?HTMLElement {
  if (typeof element !== 'string') {
    return element;
  }

  return element ? document.querySelector(element) : null;
}

/**
 * Find and return the target DOM element's position based on a step's 'target'.
 *
 * @private
 * @param {string|HTMLElement} element
 * @param {number} offset
 * @param {string} axis
 *
 * @returns {HTMLElement|undefined}
 */
export function getElementPosition(element: HTMLElement, offset: number, axis: string = 'y'): number {
  const elementRect = getClientRect(element);
  const scrollParent = getScrollParent(element);
  const hasScrollParent = hasCustomScrollParent(element);
  const isYAxis = axis === 'y';
  const rectKey = isYAxis ? 'top' : 'left';
  const scrollKey = isYAxis ? 'scrollTop' : 'scrollLeft';

  const position = elementRect[rectKey] + (!hasScrollParent && !isFixed(element) ? scrollParent[scrollKey] : 0);

  return Math.floor(position - offset);
}

/**
 * Scroll the element to the position value
 *
 * @private
 * @param  {number} value - Position value to scroll the element to
 * @param  {HTMLElement} element - The element to scroll
 * @param  {string} axis - The axis to scroll
 *
 * @returns {Promise}
 */
export function scrollTo(value: number, element: HTMLElement = scrollDoc(), axis: string = 'y'): Promise<*> {
  return new Promise((resolve, reject) => {
    const isYAxis = axis === 'y';
    const scrollMethod = isYAxis ? 'top' : 'left';
    const scrollKey = isYAxis ? 'scrollTop' : 'scrollLeft';
    const scrollValue = element[scrollKey];

    const limit = value > scrollValue ? value - scrollValue : scrollValue - value;

    scroll[scrollMethod](element, value, { duration: limit < 100 ? 50 : 300 }, (error) => {
      if (error && error.message !== 'Element already at target scroll position') {
        return reject(error);
      }

      return resolve();
    });
  });
}
