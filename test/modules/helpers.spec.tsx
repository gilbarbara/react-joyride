import * as React from 'react';
import { fromPartial } from '@total-typescript/shoehorn';

import {
  getBrowser,
  getObjectType,
  getText,
  hasValidKeys,
  hexToRGB,
  hideBeacon,
  isLegacy,
  log,
  noop,
  objectKeys,
  omit,
  pick,
  sleep,
} from '~/modules/helpers';

const baseObject = { a: 1, b: '', c: [1], d: { a: null }, e: undefined };

describe('helpers', () => {
  describe('getBrowser', () => {
    describe('with the default userAgent', () => {
      it('should identify JSDOM', () => {
        expect(getBrowser()).toContain('jsdom');
      });
    });

    describe('with chrome', () => {
      beforeAll(() => {
        // @ts-expect-error Legacy Chrome
        window.chrome = true;
      });

      afterAll(() => {
        // @ts-expect-error Legacy Chrome
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
        // @ts-expect-error Legacy Firefox
        window.InstallTrigger = true;
      });

      afterAll(() => {
        // @ts-expect-error Legacy Firefox
        delete window.InstallTrigger;
      });

      it('should identify properly', () => {
        expect(getBrowser()).toBe('firefox');
      });
    });

    describe('with ie', () => {
      beforeAll(() => {
        // @ts-expect-error Legacy IE
        document.documentMode = true;
      });

      afterAll(() => {
        // @ts-expect-error Legacy IE
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

      // @ts-expect-error Empty
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

  describe('hasValidKeys', () => {
    const validKeys = ['action', 'index', 'lifecycle', 'status'];

    const object = {
      action: 'open',
      index: 0,
      lifecycle: 'init',
      status: 'ready',
    };

    it('should return properly', () => {
      expect(hasValidKeys(object, validKeys)).toBe(true);

      expect(hasValidKeys({ ...object, bub: 1 }, validKeys)).toBe(false);
      expect(hasValidKeys({ ...object, bub: 1 })).toBe(false);
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
      expect(hideBeacon(fromPartial({ disableBeacon: false }))).toBe(false);
      expect(hideBeacon(fromPartial({ placement: 'bottom' }))).toBe(false);
      expect(hideBeacon(fromPartial({ disableBeacon: true }))).toBe(true);
      expect(hideBeacon(fromPartial({ placement: 'center' }))).toBe(true);
    });
  });

  describe('isLegacy', () => {
    it('should return properly', () => {
      expect(isLegacy()).toBe(true);
    });
  });

  describe('log', () => {
    const consoleLog = console.log;
    const consoleWarn = console.warn;
    const consoleError = console.error;
    const consoleGroupCollapsed = console.groupCollapsed;

    beforeAll(() => {
      vi.spyOn(console, 'log').mockImplementation(noop);
      vi.spyOn(console, 'warn').mockImplementation(noop);
      vi.spyOn(console, 'error').mockImplementation(noop);
      vi.spyOn(console, 'groupCollapsed').mockImplementation(noop);
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
      // @ts-expect-error Missing title
      log({
        data: { a: 1 },
        debug: true,
      });

      expect(console.error).toHaveBeenNthCalledWith(1, 'Missing title or data props');
    });

    it('should call error with missing data', () => {
      // @ts-expect-error Missing data
      log({
        title: 'Hey',
        debug: true,
      });

      expect(console.error).toHaveBeenNthCalledWith(2, 'Missing title or data props');
    });
  });

  describe('noop', () => {
    it('should return undefined', () => {
      expect(noop()).toBeUndefined();
    });
  });

  describe('objectKeys', () => {
    interface Props {
      name: string;
      type?: 'org' | 'user';
      url?: string;
    }

    it('should return properly', () => {
      const entries = objectKeys(baseObject);

      expect(entries).toEqual(Object.keys(baseObject));
      expectTypeOf(entries).toEqualTypeOf<Array<'c' | 'a' | 'b' | 'd' | 'e'>>();
    });

    it('should return properly for a custom index signature', () => {
      const props: Props = { name: 'John' };
      const entries = objectKeys(props);

      expect(entries).toEqual(Object.keys(props));
      expectTypeOf(entries).toEqualTypeOf<Array<'name' | 'type' | 'url'>>();
    });
  });

  describe('omit', () => {
    it('should return properly', () => {
      interface Payload {
        a: number;
        b: string;
      }
      const payload: Payload = { a: 1, b: '' };

      expect(omit(payload, 'b')).toEqual({ a: 1 });
      expectTypeOf(omit(payload, 'b')).toEqualTypeOf<{ a: number }>();
    });

    it.each([
      { result: omit(baseObject, 'c'), expected: { a: 1, b: '', d: { a: null } } },
      { result: omit(baseObject, 'a', 'd'), expected: { b: '', c: [1] } },
      // @ts-expect-error - using a non-existent key
      { result: omit(baseObject, 'x'), expected: baseObject },
      { result: omit(baseObject), expected: baseObject },
    ])('should be $result', ({ expected, result }) => {
      expect(result).toEqual(expected);
    });

    it('should throw for bad inputs', () => {
      // @ts-expect-error - invalid value
      expect(() => omit(['a'])).toThrow('Expected an object');
    });
  });

  describe('pick', () => {
    it('should return properly', () => {
      expect(pick(baseObject, 'a')).toEqual({ a: 1 });
      expectTypeOf(pick(baseObject, 'a')).toEqualTypeOf<{ a: number }>();
    });

    it.each([
      { result: pick(baseObject, 'c'), expected: { c: [1] } },
      { result: pick(baseObject, 'a', 'd'), expected: { a: 1, d: { a: null } } },
      // @ts-expect-error - invalid value
      { result: pick(baseObject, 'x'), expected: {} },
      { result: pick(baseObject), expected: baseObject },
    ])('should be $result', ({ expected, result }) => {
      expect(result).toEqual(expected);
    });

    it('should throw for bad inputs', () => {
      // @ts-expect-error - invalid value
      expect(() => pick(['a'])).toThrow('Expected an object');
    });
  });

  describe('sleep', () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    afterAll(() => {
      vi.restoreAllMocks();
    });

    it.each([
      { input: 0.1, timeout: 100 },
      { input: undefined, timeout: 1000 },
    ])('should halt the execution for $input', async ({ input, timeout }) => {
      const fn = async () => {
        await sleep(input);

        return 'finished';
      };

      await expect(fn()).resolves.toBe('finished');
      expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), timeout);
    });
  });
});
