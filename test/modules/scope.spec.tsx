/* eslint-disable testing-library/no-render-in-lifecycle */
import React from 'react';

import Scope from '~/modules/scope';

import ScopeComponent from '../__fixtures__/ScopeComponent';
import { render, screen } from '../__fixtures__/test-utils';

const addEventListener = jest.spyOn(window, 'addEventListener');
const removeEventListener = jest.spyOn(window, 'removeEventListener');

const canBeTabbedCount = 7;
const canHaveFocusCount = 4;

const mocks: Record<string, jest.SpyInstance> = {};
let scopeInstance: Scope;

function setScope(scope: Scope) {
  const isVisible = scope.isVisible;

  scopeInstance = {
    ...scope,
    isVisible: (element: HTMLElement) => {
      isVisible(element);

      return true;
    },
  };

  mocks.findValidTabElements = jest.spyOn(scope, 'findValidTabElements');
  mocks.canBeTabbed = jest.spyOn(scope, 'canBeTabbed');
  mocks.canHaveFocus = jest.spyOn(scope, 'canHaveFocus');
  mocks.interceptTab = jest.spyOn(scope, 'interceptTab');
  mocks.removeScope = jest.spyOn(scope, 'removeScope');
}

describe('modules/scope', () => {
  beforeAll(() => {
    addEventListener.mockClear();
    removeEventListener.mockClear();
  });

  describe('without parameters', () => {
    let scope: Scope;

    it('should throw a TypeError', () => {
      expect(() => {
        // @ts-expect-error Testing invalid parameters
        scope = new Scope();
      }).toThrow();
    });

    it('should not have created an instance', () => {
      expect(scope).toBeUndefined();
    });
  });

  describe('with a target with multiple tabbable children', () => {
    let unmount: () => void;

    beforeAll(() => {
      ({ unmount } = render(<ScopeComponent Scope={Scope} setScope={setScope} />));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should have initialized', () => {
      expect(addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), false);
      expect(scopeInstance.element.className).toBe('component');
    });

    it('should focus the first button', async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Tab' }));

      expect(mocks.interceptTab).toHaveBeenCalledTimes(1);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(1);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(canBeTabbedCount);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(canHaveFocusCount);

      expect(screen.getByTestId('skip') === document.activeElement).toBeTrue();
    });

    it('should focus the second button', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Tab' }));

      expect(mocks.interceptTab).toHaveBeenCalledTimes(1);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(1);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(canBeTabbedCount);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(canHaveFocusCount);

      expect(screen.getByTestId('back') === document.activeElement).toBeTrue();
    });

    it('should focus the third button', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Tab' }));

      expect(mocks.interceptTab).toHaveBeenCalledTimes(1);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(1);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(canBeTabbedCount);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(canHaveFocusCount);

      expect(screen.getByTestId('primary') === document.activeElement).toBeTrue();
    });

    it('should focus the last button', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Tab' }));

      expect(mocks.interceptTab).toHaveBeenCalledTimes(1);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(1);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(canBeTabbedCount);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(canHaveFocusCount);

      expect(screen.getByTestId('close') === document.activeElement).toBeTrue();
    });

    it('should focus the first button again', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Tab' }));

      expect(mocks.interceptTab).toHaveBeenCalledTimes(1);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(1);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(canBeTabbedCount);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(canHaveFocusCount);

      expect(screen.getByTestId('skip') === document.activeElement).toBeTrue();
    });

    it('should focus the last button again with shift', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Tab', shiftKey: true }));

      expect(mocks.interceptTab).toHaveBeenCalledTimes(1);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(1);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(canBeTabbedCount);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(canHaveFocusCount);

      expect(screen.getByTestId('close') === document.activeElement).toBeTrue();
    });

    it("shouldn't respond to other keyCodes", () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
      expect(mocks.interceptTab).toHaveBeenCalledTimes(0);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(0);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(0);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(0);

      expect(screen.getByTestId('close') === document.activeElement).toBeTrue();
    });

    it('should remove listener when removing scope', () => {
      unmount();

      expect(mocks.removeScope).toHaveBeenCalledTimes(1);
      expect(removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('with a target with multiple tabbable children and an initial selector', () => {
    let unmount: () => void;

    beforeAll(() => {
      ({ unmount } = render(<ScopeComponent Scope={Scope} setScope={setScope} useSelector />));
    });

    afterAll(() => {
      unmount();
    });

    it('should have initialized', () => {
      expect(addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), false);
      expect(scopeInstance.element.className).toBe('component');
      expect(scopeInstance.options.selector).toBe('.primary');
    });

    it('should have focused the selector', () => {
      setTimeout(
        () => expect(screen.getByTestId('primary') === document.activeElement).toBeTrue(),
        100,
      );
    });
  });

  describe('with a target without tabbable children', () => {
    let unmount: () => void;

    beforeAll(() => {
      ({ unmount } = render(<ScopeComponent Scope={Scope} setScope={setScope} tabbable={false} />));
    });

    afterAll(() => {
      unmount();
    });

    it('should have initialized', () => {
      expect(addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), false);
      expect(scopeInstance.element.className).toBe('component');
    });

    it("shouldn't focus anything", () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Tab' }));

      expect(mocks.interceptTab).toHaveBeenCalledTimes(1);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(1);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(2);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(0);
    });
  });
});
