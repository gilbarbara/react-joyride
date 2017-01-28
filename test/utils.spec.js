import {
  browser,
  getRootEl,
  hexToRGB,
  logger,
  sanitizeSelector
} from '../src/scripts/utils';

const mockLog = jest.fn();
const mockWarn = jest.fn();
const mockError = jest.fn();

const consoleLog = console.log; //eslint-disable-line no-console
console.log = mockLog; //eslint-disable-line no-console
console.warn = mockWarn; //eslint-disable-line no-console
console.error = mockError; //eslint-disable-line no-console

describe('utils', () => {
  it('should be able to call `hexToRGB`', () => {
    expect(hexToRGB('#ff0044')).toEqual({ b: 68, g: 0, r: 255 });

    expect(hexToRGB('#0f4')).toEqual({ b: 68, g: 255, r: 0 });
  });

  it('should be able to call `getBrowser`', () => {
    expect(browser).toBe('');
  });

  it('should be able to call `getRootEl`', () => {
    expect(getRootEl()).toEqual(document.body);
  });

  it('should be able to call `logger`', () => {
    logger({
      msg: 'hello',
      debug: true
    });

    expect(mockLog.mock.calls[0][0]).toBe('%cjoyride');
    expect(mockLog.mock.calls[0][1]).toBe('color: #760bc5; font-weight: bold; font-size: 12px;');

    logger({
      msg: ['bye', 'bye'],
      warn: true,
      debug: true
    });

    expect(mockWarn.mock.calls[0][0]).toBe('bye');
  });

  it('should be able to call `sanitizeSelector`', () => {
    expect(sanitizeSelector({
      dataset: {
        reactid: 122
      }
    })).toEqual('[data-reactid="122"]');

    expect(mockWarn.mock.calls[1][0]).toBe('Deprecation warning: React 15.0 removed reactid. Update your code.');

    expect(sanitizeSelector({
      className: 'classy',
      dataset: '123'
    })).toEqual('.classy');

    expect(mockError.mock.calls[0][0])
      .toBe('Unsupported error: React 15.0+ doesn’t write reactid to the DOM anymore, please use a plain class in your step.');

    expect(sanitizeSelector('.classy')).toEqual('.classy');
  });
});
