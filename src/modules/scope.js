// @flow

export default class Scope {
  element: HTMLElement;
  options: Object;

  constructor(element: HTMLElement, options: ?Object = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new TypeError('Invalid parameter: element must be an HTMLElement');
    }

    this.element = element;
    this.options = options;

    window.addEventListener('keydown', this.handleKeyDown, false);

    this.setFocus();
  }

  canBeTabbed = (element: HTMLElement): boolean => {
    let { tabIndex } = element;
    if (tabIndex === null || tabIndex < 0) tabIndex = undefined;

    const isTabIndexNaN = isNaN(tabIndex);

    return !isTabIndexNaN && this.canHaveFocus(element);
  };

  canHaveFocus = (element: HTMLElement): boolean => {
    const validTabNodes = /input|select|textarea|button|object/;
    const nodeName = element.nodeName.toLowerCase();
    const res =
      (validTabNodes.test(nodeName) && !element.getAttribute('disabled')) ||
      (nodeName === 'a' && !!element.getAttribute('href'));

    return res && this.isVisible(element);
  };

  findValidTabElements = () =>
    [].slice.call(this.element.querySelectorAll('*'), 0).filter(this.canBeTabbed);

  handleKeyDown = (e: KeyboardEvent) => {
    const { keyCode = 9 } = this.options;

    /* istanbul ignore else */
    if (e.keyCode === keyCode) {
      this.interceptTab(e);
    }
  };

  interceptTab = (event: KeyboardEvent) => {
    const elements = this.findValidTabElements();

    if (!elements.length) {
      return;
    }

    event.preventDefault();
    const { shiftKey } = event;

    let x = elements.indexOf(document.activeElement);

    if (x === -1 || (!shiftKey && x + 1 === elements.length)) {
      x = 0;
    } else if (shiftKey && x === 0) {
      x = elements.length - 1;
    } else {
      x += shiftKey ? -1 : 1;
    }

    elements[x].focus();
  };

  isHidden = (element: HTMLElement) => {
    const noSize = element.offsetWidth <= 0 && element.offsetHeight <= 0;
    const style = window.getComputedStyle(element);

    if (noSize && !element.innerHTML) return true;

    return (
      (noSize && style.getPropertyValue('overflow') !== 'visible') ||
      style.getPropertyValue('display') === 'none'
    );
  };

  isVisible = (element: HTMLElement) => {
    let parentElement = element;

    while (parentElement) {
      /* istanbul ignore else */
      if (parentElement instanceof HTMLElement) {
        if (parentElement === document.body) break;
        /* istanbul ignore else */
        if (this.isHidden(parentElement)) return false;
        parentElement = parentElement.parentNode;
      }
    }

    return true;
  };

  removeScope = () => {
    window.removeEventListener('keydown', this.handleKeyDown);
  };

  checkFocus = (target: HTMLElement) => {
    if (document.activeElement !== target) {
      target.focus();
      window.requestAnimationFrame(() => this.checkFocus(target));
    }
  };

  setFocus = () => {
    const { selector } = this.options;
    if (!selector) return;

    const target = this.element.querySelector(selector);

    /* istanbul ignore else */
    if (target) {
      window.requestAnimationFrame(() => this.checkFocus(target));
    }
  };
}
