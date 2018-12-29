// @flow
import scroll from 'scroll';
import scrollDoc from 'scroll-doc';
import scrollParent from 'scrollparent';

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
 * Find and return the target DOM element based on a step's 'target'.
 *
 * @private
 * @param {string|HTMLElement} element
 *
 * @returns {HTMLElement|null}
 */
export function getElement(element: string | HTMLElement): ?HTMLElement {
  if (typeof element === 'string') {
    return element ? document.querySelector(element) : null;
  }

  return element;
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

/**
 *  Get computed style property
 *
 * @param {HTMLElement} el
 *
 * @returns {Object}
 */
export function getStyleComputedProperty(el: HTMLElement): Object {
  if (!el || el.nodeType !== 1) {
    return {};
  }

  return getComputedStyle(el);
}

/**
 * Get scroll parent with fix
 *
 * @param {HTMLElement} element
 * @param {boolean} skipFix
 *
 * @returns {*}
 */
export function getScrollParent(element: HTMLElement, skipFix: boolean): HTMLElement {
  const parent = scrollParent(element);

  if (parent.isSameNode(scrollDoc())) {
    return scrollDoc();
  }

  const hasScrolling = parent.scrollHeight > parent.offsetHeight;

  if (!hasScrolling && !skipFix) {
    parent.style.overflow = 'initial';
    return scrollDoc();
  }

  return parent;
}

/**
 * Check if the element has custom scroll parent
 *
 * @param {HTMLElement} element
 * @param {boolean} skipFix
 *
 * @returns {boolean}
 */
export function hasCustomScrollParent(element: ?HTMLElement, skipFix: boolean): boolean {
  if (!element) return false;

  const parent = getScrollParent(element, skipFix);

  return !parent.isSameNode(scrollDoc());
}

/**
 * Check if the element has custom offset parent
 *
 * @param {HTMLElement} element
 *
 * @returns {boolean}
 */
export function hasCustomOffsetParent(element: HTMLElement): boolean {
  return element.offsetParent !== document.body;
}

/**
 * Check if the element is visible
 *
 * @param {HTMLElement} element
 *
 * @returns {boolean}
 */
export function isElementVisible(element: ?HTMLElement): boolean {
  if (!element) return false;

  let parentElement = element;

  while (parentElement) {
    if (parentElement === document.body) break;

    if (parentElement instanceof HTMLElement) {
      const { display, visibility } = getComputedStyle(parentElement);

      if (display === 'none' || visibility === 'hidden') {
        return false;
      }
    }

    parentElement = parentElement.parentNode;
  }
  return true;
}

/**
 * Check if the element is fixed
 * @param {HTMLElement} el
 * @returns {boolean}
 */
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
 * Find and return the target DOM element based on a step's 'target'.
 *
 * @private
 * @param {string|HTMLElement} element
 * @param {number} offset
 * @param {boolean} skipFix
 *
 * @returns {HTMLElement|undefined}
 */
export function getElementPosition(element: HTMLElement, offset: number, skipFix: boolean): number {
  const elementRect = getClientRect(element);
  const parent = getScrollParent(element, skipFix);
  const hasScrollParent = hasCustomScrollParent(element, skipFix);

  const top = elementRect.top + (!hasScrollParent && !isFixed(element) ? parent.scrollTop : 0);

  return Math.floor(top - offset);
}

/**
 * Get the scrollTop position
 *
 * @param {HTMLElement} element
 * @param {number} offset
 * @param {boolean} skipFix
 *
 * @returns {number}
 */
export function getScrollTo(element: HTMLElement, offset: number, skipFix: boolean): number {
  if (!element) {
    return 0;
  }

  const parent = scrollParent(element);
  let top = element.offsetTop;

  if (hasCustomScrollParent(element, skipFix) && !hasCustomOffsetParent(element)) {
    top -= parent.offsetTop;
  }

  return Math.floor(top - offset);
}

/**
 * Scroll to position
 * @param {number} value
 * @param {HTMLElement} element
 * @returns {Promise<*>}
 */
export function scrollTo(value: number, element: HTMLElement = scrollDoc()): Promise<*> {
  return new Promise((resolve, reject) => {
    const { scrollTop } = element;

    const limit = value > scrollTop ? value - scrollTop : scrollTop - value;

    scroll.top(element, value, { duration: limit < 100 ? 50 : 300 }, (error) => {
      if (error && error.message !== 'Element already at target scroll position') {
        return reject(error);
      }

      return resolve();
    });
  });
}
