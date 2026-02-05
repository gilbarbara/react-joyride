import { vi } from 'vitest';

import { defaultFloaterProps, defaultLocale, defaultStep } from '~/defaults';
import { noop } from '~/modules/helpers';
import { getMergedStep, validateStep, validateSteps } from '~/modules/step';
import { fromPartial } from '~/test-utils';

import { Props, Step } from '~/types';

vi.mock('~/modules/dom', () => ({
  getElement: vi.fn(() => document.createElement('div')),
  hasCustomScrollParent: vi.fn(() => false),
}));

const baseProps: Props = {
  steps: [],
};

const baseStep: Step = {
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

      expect(result).not.toBeNull();
      expect(result?.event).toBe(defaultStep.event);
      expect(result?.placement).toBe(defaultStep.placement);
      expect(result?.offset).toBe(defaultStep.offset);
      expect(result?.disableBeacon).toBe(defaultStep.disableBeacon);
      expect(result?.disableOverlay).toBe(defaultStep.disableOverlay);
      expect(result?.spotlightPadding).toBe(defaultStep.spotlightPadding);
    });

    it('should allow tour props to override defaultStep', () => {
      const props = fromPartial<Props>({
        ...baseProps,
        disableOverlay: true,
        spotlightPadding: 20,
      });

      const result = getMergedStep(props, baseStep);

      expect(result?.disableOverlay).toBe(true);
      expect(result?.spotlightPadding).toBe(20);
    });

    it('should allow step props to override tour props', () => {
      const props = fromPartial<Props>({
        ...baseProps,
        spotlightPadding: 20,
        disableOverlay: true,
      });
      const step: Step = {
        ...baseStep,
        spotlightPadding: 5,
        disableOverlay: false,
      };

      const result = getMergedStep(props, step);

      expect(result?.spotlightPadding).toBe(5);
      expect(result?.disableOverlay).toBe(false);
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

      expect(result?.locale.next).toBe('Continue');
      expect(result?.locale.back).toBe('Return');
      expect(result?.locale.close).toBe(defaultLocale.close);
      expect(result?.locale.skip).toBe(defaultLocale.skip);
    });

    it('should merge floaterProps from defaults, props, and step', () => {
      const props = fromPartial<Props>({
        ...baseProps,
        floaterProps: {
          hideArrow: true,
        },
      });
      const step: Step = {
        ...baseStep,
        floaterProps: {
          autoOpen: true,
        },
      };

      const result = getMergedStep(props, step);

      expect(result?.floaterProps?.hideArrow).toBe(true);
      expect(result?.floaterProps?.autoOpen).toBe(true);
      expect(result?.floaterProps?.wrapperOptions).toEqual(defaultFloaterProps.wrapperOptions);
    });

    it('should calculate floater offset from step offset plus spotlightPadding', () => {
      const step: Step = {
        ...baseStep,
        offset: 15,
        spotlightPadding: 8,
      };

      const result = getMergedStep(baseProps, step);

      expect(result?.floaterProps?.offset).toBe(23);
    });

    it('should use props spotlightPadding in offset calculation when step does not have it', () => {
      const props = fromPartial<Props>({
        ...baseProps,
        spotlightPadding: 12,
      });

      const result = getMergedStep(props, baseStep);

      // defaultStep.offset (10) + props.spotlightPadding (12)
      expect(result?.floaterProps?.offset).toBe(22);
    });

    it('should set wrapperOptions.placement when placementBeacon is provided', () => {
      const step: Step = {
        ...baseStep,
        placementBeacon: 'top',
      };

      const result = getMergedStep(baseProps, step);

      expect(result?.floaterProps?.wrapperOptions?.placement).toBe('top');
    });

    it('should include styles in the merged step', () => {
      const result = getMergedStep(baseProps, baseStep);

      expect(result?.styles).toBeDefined();
      expect(result?.styles.tooltip).toBeDefined();
      expect(result?.styles.beacon).toBeDefined();
      expect(result?.styles.overlay).toBeDefined();
    });

    describe('with custom scroll parent', () => {
      beforeEach(async () => {
        const { hasCustomScrollParent } = await import('~/modules/dom');

        vi.mocked(hasCustomScrollParent).mockReturnValue(true);
      });

      afterEach(async () => {
        const { hasCustomScrollParent } = await import('~/modules/dom');

        vi.mocked(hasCustomScrollParent).mockReturnValue(false);
      });

      it('should modify preventOverflow options', () => {
        const result = getMergedStep(baseProps, baseStep);

        expect(result?.floaterProps?.modifiers?.preventOverflow?.options).toEqual({
          rootBoundary: 'viewport',
          boundary: 'clippingParents',
        });
      });
    });
  });
});
