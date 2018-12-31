const validTabNodes = /input|select|textarea|button|object/;
const TAB_KEY = 9;

class Scope {
  constructor(tooltip) {
    this.tooltip = tooltip;
  }

  canBeTabbed = (element) => {
    let tabIndex = element.getAttribute('tabindex');
    if (tabIndex === null) tabIndex = undefined;
    const isTabIndexNaN = isNaN(tabIndex);
    return (isTabIndexNaN || tabIndex >= 0) && this.canHaveFocus(element, !isTabIndexNaN);
  };

  canHaveFocus = (element, isTabIndexNotNaN) => {
    const nodeName = element.nodeName.toLowerCase();
    const res = (validTabNodes.test(nodeName) && !element.disabled)
      || (nodeName === 'a' ? element.href || isTabIndexNotNaN : isTabIndexNotNaN);
    return res && this.isVisible(element);
  };

  findValidTabElements = (element) => [].slice.call(element.querySelectorAll('*'), 0).filter(this.canBeTabbed);

  handleKeyDown = (e) => {
    if (!this.tooltip) {
      return;
    }

    if (e.keyCode === TAB_KEY) {
      this.interceptTab(this.tooltip, e);
    }
  };

  interceptTab = (node, event) => {
    const elements = this.findValidTabElements(node);
    const { shiftKey } = event;

    if (!elements.length) {
      event.preventDefault();
      return;
    }

    let x = elements.indexOf(document.activeElement);

    if (x === -1 || (!shiftKey && x + 1 === elements.length)) {
      x = 0;
    }
    else {
      x += shiftKey ? -1 : 1;
    }

    event.preventDefault();

    elements[x].focus();
  };

  isHidden = (element) => {
    const noSize = element.offsetWidth <= 0 && element.offsetHeight <= 0;
    const style = window.getComputedStyle(element);

    if (noSize && !element.innerHTML) return true;

    return (noSize && style.getPropertyValue('overflow') !== 'visible') || style.getPropertyValue('display') === 'none';
  };

  isVisible = (element) => {
    let parentElement = element;
    while (parentElement) {
      if (parentElement === document.body) break;
      if (this.isHidden(parentElement)) return false;
      parentElement = parentElement.parentNode;
    }
    return true;
  };
}

let scope;

export function setScope(element) {
  scope = new Scope(element);

  window.addEventListener('keydown', scope.handleKeyDown, false);
}

export function removeScope() {
  window.removeEventListener('keydown', scope.handleKeyDown);
}
