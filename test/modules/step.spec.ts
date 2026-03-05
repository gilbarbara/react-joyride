import { vi } from 'vitest';

import { defaultFloatingOptions, defaultProps, defaultStep, defaultStepOptions } from '~/defaults';
import { noop } from '~/modules/helpers';
import { getMergedStep, validateStep, validateSteps } from '~/modules/step';
import { fromPartial } from '~/test-utils';

import type { Props, Step } from '~/types';

vi.mock('~/modules/dom', () => ({
  getElement: vi.fn(() => document.createElement('div')),
}));

const baseProps: Props = defaultProps;

const baseStep: Step = {
  ...defaultStep,
  target: '.test-target',
  content: 'Test content',
};

describe('step', () => {
  describe('validateStep', () => {
    const consoleWarn = console.warn;
    const consoleGroupCollapsed = console.groupCollapsed;

    beforeAll(() => {
      vi.spyOn(console, 'warn').mockImplementation(noop);
      vi.spyOn(console, 'groupCollapsed').mockImplementation(noop);
    });

    afterAll(() => {
      console.warn = consoleWarn;
      console.groupCollapsed = consoleGroupCollapsed;
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

      expect(console.groupCollapsed).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith('target is missing from the step');
    });
  });

  describe('validateSteps', () => {
    const consoleWarn = console.warn;
    const consoleGroupCollapsed = console.groupCollapsed;

    beforeAll(() => {
      vi.spyOn(console, 'warn').mockImplementation(noop);
      vi.spyOn(console, 'groupCollapsed').mockImplementation(noop);
    });

    afterAll(() => {
      console.warn = consoleWarn;
      console.groupCollapsed = consoleGroupCollapsed;
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

      expect(console.groupCollapsed).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith('steps must be an array');
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

    it('should allow stepOptions to override defaultStep', () => {
      const props = fromPartial<Props>({
        ...baseProps,
        stepOptions: { ...defaultStepOptions, disableOverlay: true, spotlightPadding: 20 },
      });

      const result = getMergedStep(props, baseStep);

      expect(result).toMatchSnapshot();
    });

    it('should preserve unset stepOptions defaults when partial stepOptions is provided', () => {
      const props = fromPartial<Props>({
        ...baseProps,
        stepOptions: { disableOverlay: true },
      });

      const result = getMergedStep(props, baseStep);

      expect(result).toMatchSnapshot();
    });

    it('should allow step props to override stepOptions', () => {
      const props = fromPartial<Props>({
        ...baseProps,
        scrollOffset: 50,
        stepOptions: { ...defaultStepOptions, disableOverlay: true, spotlightPadding: 20 },
      });
      const step: Step = {
        ...baseStep,
        disableOverlay: false,
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
        scrollOffset: 50,
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
});
