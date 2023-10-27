import scroll from 'scroll';
import scrollParent from 'scrollparent';

export function canUseDOM() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

/**
 * Find the bounding client rect
 */
export function getClientRect(element: HTMLElement | null) {
  if (!element) {
    return null;
  }

  return element.getBoundingClientRect();
}

/**
 * Helper function to get the browser-normalized "document height"
 */
export function getDocumentHeight(): number {
  const { body, documentElement } = document;

  if (!body || !documentElement) {
    return 0;
  }

  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    documentElement.clientHeight,
    documentElement.scrollHeight,
    documentElement.offsetHeight,
  );
}

/**
 * Find and return the target DOM element based on a step's 'target'.
 */
export function getElement(element: string | HTMLElement): HTMLElement | null {
  /* istanbul ignore else */
  if (typeof element === 'string') {
    return document.querySelector(element);
  }

  return element;
}

/**
 *  Get computed style property
 */
export function getStyleComputedProperty(el: HTMLElement): CSSStyleDeclaration | null {
  if (!el || el.nodeType !== 1) {
    return null;
  }

  return getComputedStyle(el);
}

/**
 * Get scroll parent with fix
 */
export function getScrollParent(
  element: HTMLElement | null,
  skipFix: boolean,
  forListener?: boolean,
) {
  if (!element) {
    return scrollDocument();
  }

  const parent = scrollParent(element) as HTMLElement;

  if (parent) {
    if (parent.isSameNode(scrollDocument())) {
      if (forListener) {
        return document;
      }

      return scrollDocument();
    }

    const hasScrolling = parent.scrollHeight > parent.offsetHeight;

    /* istanbul ignore else */
    if (!hasScrolling && !skipFix) {
      parent.style.overflow = 'initial';

      return scrollDocument();
    }
  }

  return parent;
}

/**
 * Check if the element has custom scroll parent
 */
export function hasCustomScrollParent(element: HTMLElement | null, skipFix: boolean): boolean {
  if (!element) {
    return false;
  }

  const parent = getScrollParent(element, skipFix);

  return !parent.isSameNode(scrollDocument());
}

/**
 * Check if the element has custom offset parent
 */
export function hasCustomOffsetParent(element: HTMLElement): boolean {
  return element.offsetParent !== document.body;
}

/**
 * Check if an element has fixed/sticky position
 */
export function hasPosition(el: HTMLElement | Node | null, type: string = 'fixed'): boolean {
  if (!el || !(el instanceof HTMLElement)) {
    return false;
  }

  const { nodeName } = el;
  const styles = getStyleComputedProperty(el);

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }

  if (styles && styles.position === type) {
    return true;
  }

  if (!el.parentNode) {
    return false;
  }

  return hasPosition(el.parentNode, type);
}

/**
 * Check if the element is visible
 */
export function isElementVisible(element: HTMLElement): element is HTMLElement {
  if (!element) {
    return false;
  }

  let parentElement: HTMLElement | null = element;

  while (parentElement) {
    if (parentElement === document.body) {
      break;
    }

    /* istanbul ignore else */
    if (parentElement instanceof HTMLElement) {
      const { display, visibility } = getComputedStyle(parentElement);

      if (display === 'none' || visibility === 'hidden') {
        return false;
      }
    }

    parentElement = parentElement.parentElement ?? null;
  }

  return true;
}

/**
 * Find and return the target DOM element based on a step's 'target'.
 */
export function getElementPosition(
  element: HTMLElement | null,
  offset: number,
  skipFix: boolean,
): number {
  const elementRect = getClientRect(element);
  const parent = getScrollParent(element, skipFix);
  const hasScrollParent = hasCustomScrollParent(element, skipFix);
  let parentTop = 0;

  /* istanbul ignore else */
  if (parent instanceof HTMLElement) {
    parentTop = parent.scrollTop;
  }

  const top = (elementRect?.top ?? 0) + (!hasScrollParent && !hasPosition(element) ? parentTop : 0);

  return Math.floor(top - offset);
}

/**
 * Get the scrollTop position
 */
export function getScrollTo(element: HTMLElement | null, offset: number, skipFix: boolean): number {
  if (!element) {
    return 0;
  }

  const parent = scrollParent(element);
  let top = element.offsetTop;

  if (parent && hasCustomScrollParent(element, skipFix) && !hasCustomOffsetParent(element)) {
    top -= parent.offsetTop;
  }

  return Math.floor(top - offset);
}

export function scrollDocument(): Element | HTMLElement {
  return document.scrollingElement ?? document.documentElement;
}

/**
 * Scroll to position
 */
export function scrollTo(
  value: number,
  options: { duration?: number; element: Element | HTMLElement },
): Promise<void> {
  const { duration, element } = options;

  return new Promise((resolve, reject) => {
    const { scrollTop } = element;

    const limit = value > scrollTop ? value - scrollTop : scrollTop - value;

    scroll.top(element as HTMLElement, value, { duration: limit < 100 ? 50 : duration }, error => {
      if (error && error.message !== 'Element already at target scroll position') {
        return reject(error);
      }

      return resolve();
    });
  });
}
