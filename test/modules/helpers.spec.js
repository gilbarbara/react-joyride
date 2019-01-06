import React from 'react';
import {
  getBrowser,
  getObjectType,
  getText,
  hasOwnProperty,
  hasValidKeys,
  hexToRGB,
  hideBeacon,
  isEqual,
  isLegacy,
  log,
} from '../../src/modules/helpers';

describe('helpers', () => {
  describe('getBrowser', () => {
    describe('with the default userAgent', () => {
      it('should identify JSDOM', () => {
        expect(getBrowser().includes('jsdom')).toBeTrue();
      });
    });

    describe('with chrome', () => {
      beforeAll(() => {
        window.chrome = true;
      });

      afterAll(() => {
        delete window.chrome;
      });

      it('should identify properly', () => {
        expect(getBrowser()).toBe('chrome');
      });
    });

    describe('with edge', () => {
      it('should identify properly', () => {
        expect(getBrowser(navigator.userAgent.replace('jsdom', 'Edge'))).toBe('edge');
      });
    });

    describe('with firefox', () => {
      beforeAll(() => {
        window.InstallTrigger = true;
      });

      afterAll(() => {
        delete window.InstallTrigger;
      });

      it('should identify properly', () => {
        expect(getBrowser()).toBe('firefox');
      });
    });

    describe('with ie', () => {
      beforeAll(() => {
        document.documentMode = true;
      });

      afterAll(() => {
        delete document.documentMode;
      });

      it('should identify properly', () => {
        expect(getBrowser()).toBe('ie');
      });
    });

    describe('with opera', () => {
      it('should identify properly', () => {
        expect(getBrowser(navigator.userAgent.replace('jsdom', 'OPR/'))).toBe('opera');
      });
    });

    describe('with safari', () => {
      it('should identify Safari desktop', () => {
        expect(
          getBrowser(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.1 Safari/605.1.15',
          ),
        ).toBe('safari');
      });

      it('should identify Safari mobile', () => {
        expect(
          getBrowser(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
          ),
        ).toBe('safari');
      });

      it('should identify Chrome on iOS', () => {
        expect(
          getBrowser(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1',
          ),
        ).toBe('safari');
      });

      it('should identify Firefox on iOS', () => {
        expect(
          getBrowser(
            'Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) FxiOS/1.0 Mobile/12F69 Safari/600.1.4',
          ),
        ).toBe('safari');
      });
    });
  });

  describe('getObjectType', () => {
    it('should identify primitives properly', () => {
      let test;

      expect(getObjectType()).toBe('undefined');
      expect(getObjectType(test)).toBe('undefined');
      expect(getObjectType(null)).toBe('null');
      expect(getObjectType(true)).toBe('boolean');
      expect(getObjectType({})).toBe('object');
      expect(getObjectType([])).toBe('array');
      expect(getObjectType('test')).toBe('string');
      expect(getObjectType(Symbol('test'))).toBe('symbol');
    });
  });

  describe('getText', () => {
    it('should return the expected text', () => {
      const Component = (
        <div>
          <h1>Hello!</h1>
          <p>This is a test.</p>
        </div>
      );

      const Fragment = (
        <React.Fragment>
          <h1>Hello!</h1>
          <p>This is the second test.</p>
        </React.Fragment>
      );
      expect(getText(Component)).toBe('Hello! This is a test.');
      expect(getText(Fragment)).toBe('Hello! This is the second test.');
    });
  });

  describe('hasOwnProperty', () => {
    it('should match properly', () => {
      const parent = { a: 1 };
      const descendant = Object.create(parent);

      expect(hasOwnProperty(parent, 'a')).toBeTrue();

      expect(descendant.a).toBe(1);
      expect(hasOwnProperty(descendant, 'a')).toBeFalse();
    });
  });

  describe('hasValidKeys', () => {
    const validKeys = ['action', 'index', 'lifecycle', 'status'];

    const object = {
      action: 'open',
      index: 0,
      lifecycle: 'init',
      status: 'ready',
    };

    it('should return properly', () => {
      expect(hasValidKeys(object, validKeys)).toBeTrue();

      expect(hasValidKeys({ ...object, bub: 1 }, validKeys)).toBeFalse();
      expect(hasValidKeys({ ...object, bub: 1 })).toBeFalse();
    });
  });

  describe('hexToRGB', () => {
    it('should convert properly', () => {
      expect(hexToRGB('#ff0044')).toEqual([255, 0, 68]);
      expect(hexToRGB('#0f4')).toEqual([0, 255, 68]);
    });

    it('should return an empty array with invalid strings', () => {
      expect(hexToRGB('asa')).toEqual([]);
    });
  });

  describe('hidBeacon', () => {
    it('should return properly', () => {
      expect(hideBeacon({ disableBeacon: false })).toBeFalse();
      expect(hideBeacon({ placement: 'bottom' })).toBeFalse();
      expect(hideBeacon({ disableBeacon: true })).toBeTrue();
      expect(hideBeacon({ placement: 'center' })).toBeTrue();
    });
  });

  describe('isEqual', () => {
    it('should work with arrays', () => {
      expect(isEqual([1, 2], [1, 2])).toBeTrue();
      expect(isEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBeTrue();

      expect(isEqual([1, 2], ['1', '2'])).toBeFalse();
      expect(isEqual([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 3 }])).toBeFalse();
    });

    it('should work with objects', () => {
      function A() {}

      expect(isEqual({ name: 'One' }, { name: 'One' })).toBeTrue();
      expect(isEqual({ name: 'One', fn: A }, { name: 'One', fn: A })).toBeTrue();
      expect(isEqual({ name: 'One', fn: A }, { name: 'One' })).toBeFalse();
      expect(
        isEqual(
          { name: 'One', step: { target: 'test' } },
          { name: 'One', step: { target: 'test' } },
        ),
      ).toBeTrue();

      expect(isEqual({ name: 'One', step: { target: 'test' } }, { name: 'One' })).toBeFalse();

      expect(isEqual({ name: 'One' }, { name: 'One', step: { target: 'test' } })).toBeFalse();
    });

    it('should work with strings', () => {
      expect(isEqual('ab', 'ab')).toBeTrue();
      expect(isEqual('ab', 'abc')).toBeFalse();
    });

    it('should work with numbers', () => {
      expect(isEqual(123, 123)).toBeTrue();
      expect(isEqual(123, 321)).toBeFalse();
    });

    it('should work with functions', () => {
      function A() {}

      function B() {}

      expect(isEqual(A, A)).toBeTrue();
      expect(isEqual(A, B)).toBeFalse();
    });

    it('should work with DOMElements', () => {
      const A = document.createElement('div');
      const B = document.body;

      expect(isEqual(A, A)).toBeTrue();
      expect(isEqual(A, B)).toBeFalse();
    });

    it('should skip React elements', () => {
      const A = () => <div>A</div>;

      expect(isEqual(<A />, <A />)).toBeFalse();
    });

    it('should fail with missing parameters or with different type', () => {
      const fn = () => {};
      const component = () => <div>test</div>;

      expect(isEqual({}, [])).toBeFalse();
      expect(isEqual(1, 'a')).toBeFalse();
      expect(isEqual(fn, Symbol('test'))).toBeFalse();
      expect(isEqual(component, [])).toBeFalse();
      expect(isEqual('ab')).toBeFalse();
      expect(isEqual(undefined, 'ab')).toBeFalse();
      expect(isEqual()).toBeFalse();
    });
  });

  describe('isLegacy', () => {
    it('should return properly', () => {
      expect(isLegacy()).toBeTrue();
    });
  });

  describe('log', () => {
    const consoleLog = console.log;
    const consoleWarn = console.warn;
    const consoleError = console.error;
    const consoleGroupCollapsed = console.groupCollapsed;

    beforeAll(() => {
      console.log = jest.fn();
      console.warn = jest.fn();
      console.error = jest.fn();
      console.groupCollapsed = jest.fn();
    });

    afterAll(() => {
      console.log = consoleLog;
      console.warn = consoleWarn;
      console.error = consoleError;
      console.groupCollapsed = consoleGroupCollapsed;
    });

    it('should not call log', () => {
      log({
        title: 'data',
        data: { a: 1 },
      });

      expect(console.log).toHaveBeenCalledTimes(0);
    });

    it('should call log with debug: true', () => {
      log({
        title: 'Hello',
        data: 'World',
        debug: true,
      });

      expect(console.groupCollapsed).toHaveBeenNthCalledWith(
        1,
        '%creact-joyride: Hello',
        'color: #ff0044; font-weight: bold; font-size: 12px;',
      );
      expect(console.log).toHaveBeenNthCalledWith(1, 'World');

      log({
        title: 'Code',
        data: { a: 1 },
        debug: true,
      });

      expect(console.groupCollapsed).toHaveBeenNthCalledWith(
        1,
        '%creact-joyride: Hello',
        'color: #ff0044; font-weight: bold; font-size: 12px;',
      );
      expect(console.log).toHaveBeenNthCalledWith(1, 'World');
    });

    it('should call warn with debug: true and warn: true', () => {
      log({
        title: 'Warn',
        data: ['hi', { key: 'valid', value: true }],
        warn: true,
        debug: true,
      });

      expect(console.warn).toHaveBeenNthCalledWith(1, 'hi');
      expect(console.warn).toHaveBeenNthCalledWith(2, 'valid', true);
      expect(console.groupCollapsed).toHaveBeenNthCalledWith(
        3,
        '%creact-joyride: Warn',
        'color: #ff0044; font-weight: bold; font-size: 12px;',
      );
    });

    it('should call error with missing title', () => {
      log({
        data: { a: 1 },
        debug: true,
      });

      expect(console.error).toHaveBeenNthCalledWith(1, 'Missing title or data props');
    });

    it('should call error with missing data', () => {
      log({
        title: 'Hey',
        debug: true,
      });

      expect(console.error).toHaveBeenNthCalledWith(2, 'Missing title or data props');
    });
  });
});
