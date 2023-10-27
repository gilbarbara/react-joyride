import { getAddedOffsetTop, getScrollTo } from '~/modules/dom';

let element: HTMLElement | null;
let parentElement: HTMLElement | null;

describe('modules/dom', () => {
  describe('getAddedOffsetTop', () => {
    beforeEach(() => {
      element = document.createElement('div');
      parentElement = document.createElement('div');
    });

    it('should return 0 if element is null', () => {
      const result = getAddedOffsetTop(null);

      expect(result).toBe(0);
    });

    it('should return 0 if element has offsetTop equals to 0', () => {
      const result = getAddedOffsetTop(element);

      expect(result).toBe(0);
    });

    it('should return 10 if element has offsetTop equals to 10', () => {
      Object.defineProperty(element, 'offsetTop', {
        configurable: true,
        value: 10,
      });

      const result = getAddedOffsetTop(element);

      expect(result).toBe(10);
    });

    it('should return 50 if element has offsetTop equals to 20 and parentElement has offsetTop equals to 30', () => {
      Object.defineProperty(element, 'offsetTop', {
        configurable: true,
        value: 20,
      });
      Object.defineProperty(parentElement, 'offsetTop', {
        configurable: true,
        value: 30,
      });
      Object.defineProperty(element, 'offsetParent', {
        configurable: true,
        value: parentElement,
      });

      const result = getAddedOffsetTop(element);

      expect(result).toBe(50);
    });
  });

  describe('getScrollTo', () => {
    beforeEach(() => {
      element = document.createElement('div');
      parentElement = document.createElement('div');
      document.body.appendChild(parentElement);
      parentElement.appendChild(element);
    });

    it('should return 0 if element is null', () => {
      const result = getScrollTo(null, 0, false);

      expect(result).toBe(0);
    });

    it('should return 0 if element has offsetTop equals to 0', () => {
      const result = getScrollTo(element, 0, false);

      expect(result).toBe(0);
    });

    it('should return 20 if element has offsetTop equals to 20 and offset is 0', () => {
      Object.defineProperty(element, 'offsetTop', {
        configurable: true,
        value: 20,
      });

      const result = getScrollTo(element, 0, false);

      expect(result).toBe(20);
    });

    it('should return 50 if element has offsetTop equals to 20, parentElement has ofsetTop equalss to 30 and offset is 0', () => {
      Object.defineProperty(element, 'offsetTop', {
        configurable: true,
        value: 20,
      });
      Object.defineProperty(parentElement, 'offsetTop', {
        configurable: true,
        value: 30,
      });
      Object.defineProperty(element, 'offsetParent', {
        configurable: true,
        value: parentElement,
      });

      const result = getScrollTo(element, 0, false);

      expect(result).toBe(50);
    });
  });
});
