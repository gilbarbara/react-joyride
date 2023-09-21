process.env.RTL_SKIP_AUTO_CLEANUP = 'true';

if (typeof window !== 'undefined') {
  Object.defineProperty(Element.prototype, 'clientHeight', {
    writable: true,
    value: '',
  });

  Object.defineProperty(Element.prototype, 'clientWidth', {
    writable: true,
    value: '',
  });

  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    value: 50,
  });

  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: 50,
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: any) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });

  // @ts-ignore
  document.scrollingElement = {
    isSameNode: () => true,
  };
}
