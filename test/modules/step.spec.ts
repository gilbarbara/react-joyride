import { vi } from 'vitest';

import { defaultFloatingOptions, defaultOptions, defaultProps, defaultStep } from '~/defaults';
import { ACTIONS, LIFECYCLE, STATUS } from '~/literals';
import { noop } from '~/modules/helpers';
import { getMergedStep, shouldHideBeacon, validateStep, validateSteps } from '~/modules/step';
import { fromPartial } from '~/test-utils';

import type { Props, Step } from '~/types';

vi.mock('~/modules/dom', async importOriginal => {
  const actual = await importOriginal<typeof import('~/modules/dom')>();

  return {
    ...actual,
    getElement: vi.fn(() => document.createElement('div')),
  };
});

const baseProps: Props = defaultProps;

const baseStep: Step = {
  ...defaultStep,
  target: '.test-target',
  content: 'Test content',
};

describe('step', () => {
  describe('validateStep', () => {
    const consoleLog = console.log;

    beforeAll(() => {
      vi.spyOn(console, 'log').mockImplementation(noop);
    });

    afterAll(() => {
      console.log = consoleLog;
    });

    it.each([
      { input: null, expected: false, description: 'null' },
      { input: [], expected: false, description: 'array' },
      { input: 'string', expected: false, description: 'string' },
      { input: 123, expected: false, description: 'number' },
      { input: {}, expected: false, description: 'empty object (no target)' },
      { input: { content: 'x' }, expected: false, description: 'object without target' },
      { input: { target: '.foo' }, expected: true, description: 'minimal valid step' },
      { input: { target: '.foo', content: 'x' }, expected: true, description: 'full valid step' },
    ])('should return $expected for $description', ({ expected, input }) => {
      expect(validateStep(input as unknown as Step)).toBe(expected);
    });

    it('should log warnings when debug is true', () => {
      validateStep({} as Step, true);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/^tour %ctarget is missing from the step%c /),
        'font-weight: bold',
        'color: gray; font-weight: normal',
      );
    });
  });

  describe('validateSteps', () => {
    const consoleLog = console.log;

    beforeAll(() => {
      vi.spyOn(console, 'log').mockImplementation(noop);
    });

    afterAll(() => {
      console.log = consoleLog;
    });

    it.each([
      { input: null, expected: false, description: 'null' },
      { input: {}, expected: false, description: 'object' },
      { input: 'string', expected: false, description: 'string' },
      { input: [], expected: true, description: 'empty array' },
      { input: [{ target: '.a' }], expected: true, description: 'single valid step' },
      {
        input: [{ target: '.a' }, {}],
        expected: false,
        description: 'mixed valid and invalid steps',
      },
      {
        input: [{ target: '.a' }, { target: '.b' }],
        expected: true,
        description: 'all valid steps',
      },
    ])('should return $expected for $description', ({ expected, input }) => {
      expect(validateSteps(input as unknown as Array<Step>)).toBe(expected);
    });

    it('should log warnings when debug is true', () => {
      validateSteps({} as Array<Step>, true);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/^tour %csteps must be an array%c /),
        'font-weight: bold',
        'color: gray; font-weight: normal',
      );
    });
  });

  describe('getMergedStep', () => {
    it('should return null for undefined step', () => {
      expect(getMergedStep(baseProps, undefined)).toBeNull();
    });

    it('should merge defaultStep values', () => {
      const result = getMergedStep(baseProps, baseStep);

      expect(result).toMatchSnapshot();
    });

    it('should allow options to override defaultStep', () => {
      const props = fromPartial<Props>({
        ...baseProps,
        options: { ...defaultOptions, hideOverlay: true, spotlightPadding: 20 },
      });

      const result = getMergedStep(props, baseStep);

      expect(result).toMatchSnapshot();
    });

    it('should preserve unset options defaults when partial options is provided', () => {
      const props = fromPartial<Props>({
        ...baseProps,
        options: { hideOverlay: true },
      });

      const result = getMergedStep(props, baseStep);

      expect(result).toMatchSnapshot();
    });

    it('should allow step props to override options', () => {
      const props = fromPartial<Props>({
        ...baseProps,
        options: {
          ...defaultOptions,
          hideOverlay: true,
          spotlightPadding: 20,
          scrollOffset: 50,
        },
      });
      const step: Step = {
        ...baseStep,
        hideOverlay: false,
        scrollOffset: 10,
        spotlightPadding: 5,
      };

      const result = getMergedStep(props, step);

      expect(result).toMatchSnapshot();
    });

    it('should merge locale from defaults, props, and step', () => {
      const props = fromPartial<Props>({
        ...baseProps,
        locale: { next: 'Continue' },
      });
      const step: Step = {
        ...baseStep,
        locale: { back: 'Return' },
      };

      const result = getMergedStep(props, step);

      expect(result?.locale).toMatchSnapshot();
    });

    it('should merge floatingOptions from defaults, props, and step', () => {
      const props = fromPartial<Props>({
        ...baseProps,
        floatingOptions: { strategy: 'fixed' },
      });
      const step: Step = {
        ...baseStep,
        floatingOptions: { beaconOptions: { offset: -10 } },
      };

      const result = getMergedStep(props, step);

      expect(result?.floatingOptions).toMatchSnapshot();
      expect(defaultFloatingOptions.beaconOptions?.offset).toBe(-18);
    });

    it('should include styles in the merged step', () => {
      const result = getMergedStep(baseProps, baseStep);

      expect(result?.styles).toMatchSnapshot();
    });

    it('should merge scrollOffset from props', () => {
      const props = fromPartial<Props>({
        ...baseProps,
        options: { scrollOffset: 50 },
      });

      const result = getMergedStep(props, baseStep);

      expect(result).toMatchSnapshot();
    });

    it('should pass step.id through when provided', () => {
      const step: Step = {
        ...baseStep,
        id: 'my-step',
      };

      const result = getMergedStep(baseProps, step);

      expect(result?.id).toBe('my-step');
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
});
