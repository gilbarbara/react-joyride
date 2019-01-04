// @flow

export default class Scope {
  element: HTMLElement;
  options: Object;

  constructor(element: HTMLElement, options: ?Object) {
    if (!(element instanceof HTMLElement)) {
      throw new Error('Invalid parameter: element must be an HTMLElement');
    }

    this.element = element;
    this.options = options;

    window.addEventListener('keydown', this.handleKeyDown, false);

    this.setFocus();
  }

  canBeTabbed = (element: HTMLElement): boolean => {
    const tabIndex = element.getAttribute('tabindex') || undefined;
    const isTabIndexNaN = isNaN(tabIndex);

    return (isTabIndexNaN || !!tabIndex) && this.canHaveFocus(element, !isTabIndexNaN);
  };

  canHaveFocus = (element: HTMLElement, isTabIndexNotNaN: boolean): boolean => {
    const validTabNodes = /input|select|textarea|button|object/;
    const nodeName = element.nodeName.toLowerCase();
    const res = (validTabNodes.test(nodeName) && !element.getAttribute('disabled'))
      || (nodeName === 'a' ? element.getAttribute('href') || isTabIndexNotNaN : isTabIndexNotNaN);

    return res && this.isVisible(element);
  };

  findValidTabElements = () => [].slice.call(this.element.querySelectorAll('*'), 0).filter(this.canBeTabbed);

  handleKeyDown = (e: KeyboardEvent) => {
    const { keyCode = 9 } = this.options;

    if (!this.element) {
      return;
    }

    if (e.keyCode === keyCode) {
      this.interceptTab(e);
    }
  };

  interceptTab = (event: KeyboardEvent) => {
    event.preventDefault();
    const elements = this.findValidTabElements();
    const { shiftKey } = event;

    if (!elements.length) {
      return;
    }

    let x = elements.indexOf(document.activeElement);

    if (x === -1 || (!shiftKey && x + 1 === elements.length)) {
      x = 0;
    }
    else if (shiftKey && x === 0) {
      x = elements.length - 1;
    }
    else {
      x += shiftKey ? -1 : 1;
    }

    elements[x].focus();
  };

  isHidden = (element: HTMLElement) => {
    const noSize = element.offsetWidth <= 0 && element.offsetHeight <= 0;
    const style = window.getComputedStyle(element);

    if (noSize && !element.innerHTML) return true;

    return (noSize && style.getPropertyValue('overflow') !== 'visible') || style.getPropertyValue('display') === 'none';
  };

  isVisible = (element: HTMLElement) => {
    let parentElement = element;

    while (parentElement) {
      if (parentElement instanceof HTMLElement) {
        if (parentElement === document.body) break;
        if (this.isHidden(parentElement)) return false;
        parentElement = parentElement.parentNode;
      }
    }

    return true;
  };

  removeScope = () => {
    window.removeEventListener('keydown', this.handleKeyDown);
  };

  setFocus = () => {
    const { selector } = this.options;
    if (!selector) return;

    const target = this.element.querySelector(selector);

    if (target) {
      target.focus();
    }
  };
}
