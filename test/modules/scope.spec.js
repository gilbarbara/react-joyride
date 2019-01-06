import React from 'react';
import Scope from '../../src/modules/scope';
import Tooltip from '../__fixtures__/Tooltip';

const addEventListener = jest.spyOn(window, 'addEventListener');
const removeEventListener = jest.spyOn(window, 'removeEventListener');

const elements = 8;
const validElements = 4;

describe('modules/scope', () => {
  describe('without parameters', () => {
    let scope;

    it('should throw a TypeError', () => {
      expect(() => {
        scope = new Scope();
      }).toThrowError();
    });

    it('should not have created an instance', () => {
      // expect(Scope).toHaveBeenCalledTimes(1);
      expect(scope).toBeUndefined();
    });
  });

  describe('with a target with multiple tabbable children', () => {
    let wrapper;
    let scope;
    const mocks = {};

    const setScope = scopeInstance => {
      scope = scopeInstance;
      const isVisible = scope.isVisible;

      mocks.findValidTabElements = jest.spyOn(scopeInstance, 'findValidTabElements');
      mocks.canBeTabbed = jest.spyOn(scopeInstance, 'canBeTabbed');
      mocks.canHaveFocus = jest.spyOn(scopeInstance, 'canHaveFocus');
      mocks.interceptTab = jest.spyOn(scopeInstance, 'interceptTab');
      mocks.removeScope = jest.spyOn(scopeInstance, 'removeScope');
      scope.isVisible = element => {
        isVisible(element);
        return true;
      };
    };

    beforeAll(() => {
      wrapper = mount(<Tooltip Scope={Scope} setScope={setScope} />, {
        attachTo: document.getElementById('react'),
      });
    });

    it('should have initialized', () => {
      expect(addEventListener).toHaveBeenLastCalledWith('keydown', expect.any(Function), false);
      expect(scope.element.className).toBe('tooltip');
    });

    it('should focus the first button', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 9 }));

      expect(mocks.interceptTab).toHaveBeenCalledTimes(1);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(1);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(elements);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(validElements);

      expect(wrapper.find('.skip').instance() === document.activeElement).toBeTrue();
    });

    it('should focus the second button', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 9 }));

      expect(mocks.interceptTab).toHaveBeenCalledTimes(2);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(2);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(elements * 2);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(validElements * 2);

      expect(wrapper.find('.back').instance() === document.activeElement).toBeTrue();
    });

    it('should focus the third button', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 9 }));

      expect(mocks.interceptTab).toHaveBeenCalledTimes(3);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(3);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(elements * 3);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(validElements * 3);

      expect(wrapper.find('.primary').instance() === document.activeElement).toBeTrue();
    });

    it('should focus the last button', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 9 }));

      expect(mocks.interceptTab).toHaveBeenCalledTimes(4);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(4);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(elements * 4);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(validElements * 4);

      expect(wrapper.find('.close').instance() === document.activeElement).toBeTrue();
    });

    it('should focus the first button again', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 9 }));

      expect(mocks.interceptTab).toHaveBeenCalledTimes(5);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(5);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(elements * 5);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(validElements * 5);

      expect(wrapper.find('.skip').instance() === document.activeElement).toBeTrue();
    });

    it('should focus the last button again with shift', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 9, shiftKey: true }));

      expect(mocks.interceptTab).toHaveBeenCalledTimes(6);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(6);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(elements * 6);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(validElements * 6);

      expect(wrapper.find('.close').instance() === document.activeElement).toBeTrue();
    });

    it("shouldn't respond to other keyCodes", () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 15 }));
      expect(mocks.interceptTab).toHaveBeenCalledTimes(6);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(6);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(elements * 6);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(validElements * 6);

      expect(wrapper.find('.close').instance() === document.activeElement).toBeTrue();
    });

    it('should remove listener when removing scope', () => {
      wrapper.unmount();

      expect(mocks.removeScope).toHaveBeenCalledTimes(1);
      expect(removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });

  describe('with a target with multiple tabbable children and an initial selector', () => {
    let wrapper;
    let scope;

    const setScope = scopeInstance => {
      scope = scopeInstance;
      scope.isVisible = () => true;
    };

    beforeAll(() => {
      wrapper = mount(<Tooltip Scope={Scope} setScope={setScope} useSelector={true} />, {
        attachTo: document.getElementById('react'),
      });
    });

    it('should have initialized', () => {
      expect(addEventListener).toHaveBeenLastCalledWith('keydown', expect.any(Function), false);
      expect(scope.element.className).toBe('tooltip');
      expect(scope.options.selector).toBe('.primary');
    });

    it('should have focused the selector', () => {
      expect(wrapper.find('.primary').instance() === document.activeElement).toBeTrue();
    });
  });

  describe('with a target without tabbable children', () => {
    let scope;
    const mocks = {};

    const setScope = scopeInstance => {
      scope = scopeInstance;

      mocks.findValidTabElements = jest.spyOn(scopeInstance, 'findValidTabElements');
      mocks.canBeTabbed = jest.spyOn(scopeInstance, 'canBeTabbed');
      mocks.canHaveFocus = jest.spyOn(scopeInstance, 'canHaveFocus');
      mocks.interceptTab = jest.spyOn(scopeInstance, 'interceptTab');
      scope.isVisible = () => true;
    };

    beforeAll(() => {
      mount(<Tooltip Scope={Scope} setScope={setScope} tabbable={false} />, {
        attachTo: document.getElementById('react'),
      });
    });

    it('should have initialized', () => {
      expect(addEventListener).toHaveBeenLastCalledWith('keydown', expect.any(Function), false);
      expect(scope.element.className).toBe('tooltip');
    });

    it("shouldn't focus anything", () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 9 }));

      expect(mocks.interceptTab).toHaveBeenCalledTimes(1);
      expect(mocks.findValidTabElements).toHaveBeenCalledTimes(1);
      expect(mocks.canBeTabbed).toHaveBeenCalledTimes(2);
      expect(mocks.canHaveFocus).toHaveBeenCalledTimes(0);
    });
  });
});
