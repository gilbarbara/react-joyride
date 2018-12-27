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

describe('helpers', () => {
  it('should be able to call `hexToRGB`', () => {
    expect(hexToRGB('#ff0044')).toEqual([255, 0, 68]);
    expect(hexToRGB('#0f4')).toEqual([0, 255, 68]);
  });

  it('should be able to call `log`', () => {
    log({
      title: 'hello',
      data: 'World',
      debug: true,
    });

    expect(mockLog).toHaveBeenCalledWith('World');

    log({
      title: 'noou',
      data: ['hi', 'bye'],
      warn: true,
      debug: true,
    });

    expect(mockWarn).toHaveBeenCalledWith('hi');
    expect(mockWarn).toHaveBeenCalledWith('bye');

    log({
      title: 'data',
      data: { a: 1 },
      debug: false,
    });

    expect(mockLog).toHaveBeenCalledTimes(1);
  });
});
