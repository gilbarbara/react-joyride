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
} from '~/modules/helpers';

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
});
