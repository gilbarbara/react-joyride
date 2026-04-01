import { LIFECYCLE } from '~/literals';
import { needsScrolling } from '~/modules/dom';
import { fromPartial } from '~/test-utils';

import type { StepMerged } from '~/types';

describe('dom', () => {
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
});
