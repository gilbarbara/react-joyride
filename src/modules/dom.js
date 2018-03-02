// @flow
import is from '@sindresorhus/is';
import scroll from 'scroll';
import scrollDoc from 'scroll-doc';

/**
 * Find and return the target DOM element based on a step's 'target'.
 *
 * @private
 * @param {string|HTMLElement} target
 *
 * @returns {HTMLElement|undefined}
 */
export function getElement(target: string | HTMLElement): ?HTMLElement {
  if (typeof target === 'string') {
    return document.querySelector(target);
  }

  return target;
}

/**
 * Get the scroll position.
 *
 * @returns {Number|*|number}
 */
export function getScrollTop(): number {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

/**
 * Find the bounding client rect
 *
 * @private
 * @param {HTMLElement} element - The target element
 * @param {HTMLElement} [offsetParent] - The parent element to calculate offsets from
 * @returns {Object}
 */
export function getOffsetBoundingClientRect(element: HTMLElement, offsetParent: HTMLElement): Object {
  const elementRect = element.getBoundingClientRect();

  if (!offsetParent) {
    return elementRect;
  }

  const offsetParentRect = offsetParent.getBoundingClientRect();

  const offsetTop = offsetParentRect.top > 0 ? elementRect.top - offsetParentRect.top : elementRect.top;
  const offsetLeft = offsetParentRect.left > 0 ? elementRect.left - offsetParentRect.left : elementRect.left;
  const offsetRight = offsetParentRect.right > 0 ? offsetParentRect.right - elementRect.right : elementRect.right;
  const offsetBottom = offsetParentRect.bottom > 0 ? offsetParentRect.bottom - elementRect.bottom : elementRect.bottom;

  return {
    top: offsetTop,
    left: offsetLeft,
    right: offsetRight,
    bottom: offsetBottom,
    x: offsetLeft,
    y: offsetTop,
    width: elementRect.width,
    height: elementRect.height,
  };
}

/**
 * Get the scrollTop position
 *
 * @param {HTMLElement} target
 * @param {HTMLElement} offsetParent
 *
 * @returns {number}
 */
export function getElementScrollY(target: HTMLElement, offsetParent: HTMLElement): number {
  if (!target || !offsetParent) {
    return 0;
  }

  const targetRect = getOffsetBoundingClientRect(target, offsetParent);
  const targetTop = targetRect.top + getScrollTop();

  return Math.floor(targetTop);
}

export function scrollTo(value: number) {
  scroll.top(scrollDoc(), value);
}

export function getStyleComputedProperty(el: HTMLElement): Object {
  if (el.nodeType !== 1) {
    return {};
  }

  return getComputedStyle(el);
}

export function isFixed(el?: HTMLElement): boolean {
  if (!el) {
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
