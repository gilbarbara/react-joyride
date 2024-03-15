interface ScopeOptions {
  code?: string;
  selector: string | null;
}

export default class Scope {
  element: HTMLElement;
  options: ScopeOptions;

  constructor(element: HTMLElement, options: ScopeOptions) {
    if (!(element instanceof HTMLElement)) {
      throw new TypeError('Invalid parameter: element must be an HTMLElement');
    }

    this.element = element;
    this.options = options;

    window.addEventListener('keydown', this.handleKeyDown, false);

    this.setFocus();
  }

  canBeTabbed = (element: HTMLElement): boolean => {
    const { tabIndex } = element;

    if (tabIndex === null || tabIndex < 0) {
      return false;
    }

    return this.canHaveFocus(element);
  };

  canHaveFocus = (element: HTMLElement): boolean => {
    const validTabNodes = /input|select|textarea|button|object/;
    const nodeName = element.nodeName.toLowerCase();

    const isValid =
      (validTabNodes.test(nodeName) && !element.getAttribute('disabled')) ||
      (nodeName === 'a' && !!element.getAttribute('href'));

    return isValid && this.isVisible(element);
  };

  findValidTabElements = (): Array<HTMLElement> =>
    [].slice.call(this.element.querySelectorAll('*'), 0).filter(this.canBeTabbed);

  handleKeyDown = (event: KeyboardEvent) => {
    const { code = 'Tab' } = this.options;

    if (event.code === code) {
      this.interceptTab(event);
    }
  };

  interceptTab = (event: KeyboardEvent) => {
    event.preventDefault();
    const elements = this.findValidTabElements();
    const { shiftKey } = event;

    if (!elements.length) {
      return;
    }

    let x = document.activeElement ? elements.indexOf(document.activeElement as HTMLElement) : 0;

    if (x === -1 || (!shiftKey && x + 1 === elements.length)) {
      x = 0;
    } else if (shiftKey && x === 0) {
      x = elements.length - 1;
    } else {
      x += shiftKey ? -1 : 1;
    }

    elements[x].focus();
  };

  // eslint-disable-next-line class-methods-use-this
  isHidden = (element: HTMLElement) => {
    const noSize = element.offsetWidth <= 0 && element.offsetHeight <= 0;
    const style = window.getComputedStyle(element);

    if (noSize && !element.innerHTML) {
      return true;
    }

    return (
      (noSize && style.getPropertyValue('overflow') !== 'visible') ||
      style.getPropertyValue('display') === 'none'
    );
  };

  isVisible = (element: HTMLElement): boolean => {
    let parentElement: HTMLElement | null = element;

    while (parentElement) {
      if (parentElement instanceof HTMLElement) {
        if (parentElement === document.body) {
          break;
        }

        if (this.isHidden(parentElement)) {
          return false;
        }

        parentElement = parentElement.parentNode as HTMLElement;
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

    if (!selector) {
      return;
    }

    const target = this.element.querySelector(selector);

    if (target) {
      window.requestAnimationFrame(() => this.checkFocus(target as HTMLElement));
    }
  };
}
