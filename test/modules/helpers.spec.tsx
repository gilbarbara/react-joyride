/* eslint-disable react/jsx-curly-brace-presence */
import type { ReactNode } from 'react';

import { ACTIONS, LIFECYCLE, STATUS } from '~/literals';
import {
  cleanUpObject,
  deepMerge,
  getObjectType,
  getReactNodeText,
  hexToRGB,
  log,
  mergeProps,
  needsScrolling,
  noop,
  objectKeys,
  omit,
  pick,
  replaceLocaleContent,
  shouldHideBeacon,
  sortObjectKeys,
} from '~/modules/helpers';
import { fromPartial } from '~/test-utils';

import type { Step, StepMerged } from '~/types';

interface Props {
  name: string;
  type?: 'org' | 'user';
  url?: string;
}

const baseObject = { a: 1, b: '', c: [1], d: { a: null }, e: undefined };

function NextWithProgress() {
  return <strong data-testid="next-label">{`Go ({current} of {total})`}</strong>;
}

function Skip() {
  return <strong data-testid="skip-label">Do you really want to skip?</strong>;
}

describe('helpers', () => {
  describe('cleanUpObject', () => {
    it('should remove the undefined properties', () => {
      expect(cleanUpObject(baseObject)).toEqual(omit(baseObject, 'e'));
      expectTypeOf(cleanUpObject(baseObject)).toEqualTypeOf<{
        a: number;
        b: string;
        c: Array<number>;
        d: { a: null };
      }>();
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

  describe('getReactNodeText', () => {
    it('should return properly', () => {
      expect(getReactNodeText(<Skip />)).toBe('Do you really want to skip?');
      expect(getReactNodeText(<NextWithProgress />, { step: 2, steps: 5 })).toBe('Go (2 of 5)');
      expect(
        getReactNodeText(<span>Next {`({current} of {total})`}</span>, { step: 2, steps: 5 }),
      ).toBe('Next (2 of 5)');
      expect(getReactNodeText('Next ({current} of {total})', { step: 2, steps: 5 })).toBe(
        'Next (2 of 5)',
      );
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

  describe('shouldHideBeacon', () => {
    const baseState = {
      action: ACTIONS.START,
      controlled: true,
      index: 0,
      lifecycle: LIFECYCLE.INIT,
      origin: null,
      scrolling: false,
      size: 5,
      status: STATUS.RUNNING,
      waiting: false,
    };

    const baseParameters = { step: { placement: 'auto' }, state: baseState, continuous: true };

    it.each([
      { ...baseParameters, step: { skipBeacon: false }, expected: false },
      { ...baseParameters, step: { skipBeacon: true }, expected: true },
      { ...baseParameters, step: { placement: 'bottom' }, expected: false },
      { ...baseParameters, step: { placement: 'center' }, expected: true },
      {
        ...baseParameters,
        step: { placement: 'auto' },
        state: { ...baseState, action: ACTIONS.NEXT },
        expected: true,
      },
      {
        ...baseParameters,
        step: { placement: 'auto' },
        state: { ...baseState, action: ACTIONS.PREV },
        expected: true,
      },
      {
        ...baseParameters,
        state: { ...baseState, action: ACTIONS.UPDATE },
        expected: false,
      },
      {
        ...baseParameters,
        state: { ...baseState, action: ACTIONS.STOP },
        expected: false,
      },

      {
        ...baseParameters,
        step: { placement: 'auto' },
        state: { ...baseState, action: ACTIONS.NEXT },
        continuous: false,
        expected: false,
      },
    ])('should return properly', ({ continuous, expected, state, step }) => {
      expect(shouldHideBeacon(fromPartial(step as Partial<Step>), state, continuous)).toBe(
        expected,
      );
    });
  });

  describe('log', () => {
    const consoleLog = console.log;

    beforeAll(() => {
      vi.spyOn(console, 'log').mockImplementation(noop);
    });

    afterAll(() => {
      console.log = consoleLog;
    });

    it('should not call log when debug is false', () => {
      log(false, 'tour', 'data', { a: 1 });

      expect(console.log).toHaveBeenCalledTimes(0);
    });

    it('should log with data', () => {
      log(true, 'tour', 'Hello', 'World');

      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/^tour %cHello%c \d{2}:\d{2}:\d{2}\.\d{3}$/),
        'font-weight: bold',
        'color: gray; font-weight: normal',
        'World',
      );
    });

    it('should log with step scope', () => {
      log(true, 'step:0', 'state', { a: 1 });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/^step:0 %cstate%c /),
        'font-weight: bold',
        'color: gray; font-weight: normal',
        { a: 1 },
      );
    });

    it('should log without data', () => {
      log(true, 'tour', 'Hey');

      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/^tour %cHey%c /),
        'font-weight: bold',
        'color: gray; font-weight: normal',
      );
    });
  });

  describe('mergeProps', () => {
    it('should return properly', () => {
      const defaultProps = { type: 'user' } satisfies Omit<Props, 'name'>;
      const props: Props = { name: 'John', url: undefined };

      expect(mergeProps(defaultProps, props)).toEqual({ name: 'John', type: 'user' });
      expectTypeOf(mergeProps(defaultProps, props)).toEqualTypeOf<{
        name: string;
        type: 'org' | 'user';
        url?: string;
      }>();
    });
  });

  describe('noop', () => {
    it('should return undefined', () => {
      expect(noop()).toBeUndefined();
    });
  });

  describe('objectKeys', () => {
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

  describe('replaceLocaleContent', () => {
    it('should replace the content properly', () => {
      expect(replaceLocaleContent(<NextWithProgress />, 2, 5)).toEqual(
        <strong data-testid="next-label">Go (2 of 5)</strong>,
      );
      expect(replaceLocaleContent(<span>{`Next ({current} of {total})`}</span>, 2, 5)).toEqual(
        <span>Next (2 of 5)</span>,
      );
      expect(replaceLocaleContent('Next ({current} of {total})', 2, 5)).toEqual('Next (2 of 5)');
      expect(replaceLocaleContent(null, 2, 5)).toEqual(null);
    });

    it('should handle array children with mixed content', () => {
      expect(replaceLocaleContent(<span>Step {`{current} of {total}`}</span>, 2, 5)).toEqual(
        <span>Step {'2 of 5'}</span>,
      );
    });

    it('should handle array children with nested elements', () => {
      expect(
        replaceLocaleContent(
          <span>
            {'Step'} <em>{`{current} of {total}`}</em>
          </span>,
          3,
          7,
        ),
      ).toEqual(
        <span>
          {'Step'} <em>3 of 7</em>
        </span>,
      );
    });

    it('should return the input for elements without placeholders', () => {
      const input = (
        <div>
          <img alt="" />
        </div>
      );

      expect(replaceLocaleContent(input, 1, 3)).toEqual(input);
    });
  });

  describe('deepMerge', () => {
    it('should merge plain objects deeply', () => {
      const result = deepMerge<{ a: { b: number; c: number } }>({ a: { b: 1 } }, { a: { c: 2 } });

      expect(result).toEqual({ a: { b: 1, c: 2 } });
    });

    it('should not recurse into React elements', () => {
      const element = <div>test</div>;
      const result = deepMerge<{ content: ReactNode }>({ content: 'old' }, { content: element });

      expect(result.content).toBe(element);
    });

    it('should handle nested objects with React element values', () => {
      const element = <span />;
      const result = deepMerge<{ step: { content: ReactNode; title: string } }>(
        { step: { title: 'old', content: 'old' } },
        { step: { content: element } },
      );

      expect(result.step.title).toBe('old');
      expect(result.step.content).toBe(element);
    });

    it('should preserve Date and RegExp instances', () => {
      const date = new Date();
      const regex = /test/;
      const result = deepMerge<{ d: Date; r: RegExp }>({ d: date, r: regex }, {});

      expect(result.d).toBe(date);
      expect(result.r).toBe(regex);
    });

    it('should merge multiple objects', () => {
      const result = deepMerge<{ a: number; b: number; c: number }>({ a: 1 }, { b: 2 }, { c: 3 });

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });
  });

  describe('needsScrolling', () => {
    const target = document.createElement('div');
    const baseStep = fromPartial<StepMerged>({
      skipScroll: false,
      isFixed: false,
      placement: 'bottom',
    });
    const baseOptions = {
      isFirstStep: false,
      scrollToFirstStep: false,
      step: baseStep,
      target,
      targetLifecycle: LIFECYCLE.BEACON,
    };

    it.each([
      { ...baseOptions, label: 'base case', expected: true },
      {
        ...baseOptions,
        step: fromPartial<StepMerged>({ ...baseStep, skipScroll: true }),
        label: 'skipScroll',
        expected: false,
      },
      {
        ...baseOptions,
        isFirstStep: true,
        label: 'first step without scrollToFirstStep',
        expected: false,
      },
      {
        ...baseOptions,
        isFirstStep: true,
        scrollToFirstStep: true,
        label: 'first step with scrollToFirstStep',
        expected: true,
      },
      {
        ...baseOptions,
        isFirstStep: true,
        targetLifecycle: LIFECYCLE.TOOLTIP,
        label: 'first step with tooltip lifecycle',
        expected: true,
      },
      {
        ...baseOptions,
        step: fromPartial<StepMerged>({ ...baseStep, placement: 'center' }),
        label: 'center placement',
        expected: false,
      },
      {
        ...baseOptions,
        target: null,
        label: 'null target',
        expected: true,
      },
    ])('should return $expected for $label', ({ expected, label: _, ...options }) => {
      expect(needsScrolling(options)).toBe(expected);
    });

    it('should return false for target with fixed ancestor', () => {
      const fixedTarget = document.createElement('div');

      fixedTarget.style.position = 'fixed';
      document.body.appendChild(fixedTarget);

      expect(
        needsScrolling({
          ...baseOptions,
          target: fixedTarget,
        }),
      ).toBe(false);

      document.body.removeChild(fixedTarget);
    });

    it('should return false for fixed step', () => {
      document.body.appendChild(target);

      expect(
        needsScrolling({
          ...baseOptions,
          step: fromPartial<StepMerged>({ ...baseStep, isFixed: true }),
        }),
      ).toBe(false);

      document.body.removeChild(target);
    });

    it('should return false for fixed step with fixed target', () => {
      const fixedTarget = document.createElement('div');

      fixedTarget.style.position = 'fixed';
      document.body.appendChild(fixedTarget);

      expect(
        needsScrolling({
          ...baseOptions,
          target: fixedTarget,
          step: fromPartial<StepMerged>({ ...baseStep, isFixed: true }),
        }),
      ).toBe(false);

      document.body.removeChild(fixedTarget);
    });

    it('should return true for fixed target with scrollable parent', () => {
      const fixedContainer = document.createElement('div');

      fixedContainer.style.position = 'fixed';
      fixedContainer.style.overflow = 'auto';
      Object.defineProperty(fixedContainer, 'scrollHeight', { value: 500, configurable: true });
      Object.defineProperty(fixedContainer, 'offsetHeight', { value: 200, configurable: true });

      const childTarget = document.createElement('div');

      fixedContainer.appendChild(childTarget);
      document.body.appendChild(fixedContainer);

      expect(
        needsScrolling({
          ...baseOptions,
          target: childTarget,
        }),
      ).toBe(true);

      document.body.removeChild(fixedContainer);
    });
  });

  describe('sortObjectKeys', () => {
    it('should return properly', () => {
      const value = sortObjectKeys({
        zar: 'raz',
        foo: 'bar',
        tar: 'foo',
        arg: 'tar',
      });

      expect(value).toMatchSnapshot();
      expectTypeOf(value).toEqualTypeOf<{ arg: string; foo: string; tar: string; zar: string }>();
    });
  });
});
