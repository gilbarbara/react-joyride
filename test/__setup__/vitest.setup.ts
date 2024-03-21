import '@testing-library/jest-dom';

import { configure } from '@testing-library/react';
import * as matchers from 'jest-extended';

import { noop } from '~/modules/helpers';

configure({ testIdAttribute: 'data-test-id' });
expect.extend(matchers);

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

  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    value: 50,
  });

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: any) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: noop(), // deprecated
      removeListener: noop(), // deprecated
      addEventListener: noop(),
      removeEventListener: noop(),
      dispatchEvent: noop(),
    }),
  });

  // @ts-expect-error - JSDOM does not have this property
  document.scrollingElement = {
    isSameNode: () => true,
  };
}
