import {
  hexToRGB,
  log,
} from '../../src/modules/helpers';

const mockLog = jest.fn();
const mockWarn = jest.fn();
const mockError = jest.fn();

console.log = mockLog; //eslint-disable-line no-console
console.warn = mockWarn; //eslint-disable-line no-console
console.error = mockError; //eslint-disable-line no-console

describe('utils', () => {
  it('should be able to call `hexToRGB`', () => {
    expect(hexToRGB('#ff0044')).toEqual([255, 0, 68]);
    expect(hexToRGB('#0f4')).toEqual([0, 255, 68]);
  });

  xit('should be able to call `log`', () => {
    log({
      title: 'hello',
      debug: true,
    });

    expect(mockLog.mock.calls[0][0]).toBe('%cjoyride');
    expect(mockLog.mock.calls[0][1]).toBe('color: #760bc5; font-weight: bold; font-size: 12px;');

    log({
      title: 'noou',
      msg: ['bye', 'bye'],
      warn: true,
      debug: true,
    });

    expect(mockWarn.mock.calls[0][0]).toBe('bye');
  });
});
