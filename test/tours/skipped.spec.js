import React from 'react';

import Standard from '../__fixtures__/Standard';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '../../src';

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  return class {
    static placements = PopperJS.placements;

    constructor() {
      return {
        destroy: () => {},
        scheduleUpdate: () => {},
      };
    }
  };
});

console.warn = jest.fn();

const mockCallback = jest.fn();
const props = {
  callback: mockCallback,
};

function initPopper(wrapper) {
  const Step = wrapper.find('JoyrideStep').instance();
  Step.setPopper({ popper: {} }, 'wrapper');
  Step.setPopper({ popper: {} }, 'tooltip');
}

describe('Joyride > Skipped', () => {
  let wrapper;
  let joyride;

  beforeAll(() => {
    wrapper = mount(<Standard {...props} />, { attachTo: document.getElementById('react') });
    joyride = wrapper.find('Joyride').instance();
  });

  it('should have initiated the Joyride', () => {
    expect(joyride.state).toMatchSnapshot();
  });

  it('should be able to start the tour', () => {
    wrapper.find('.hero__start').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.START,
      controlled: false,
      index: 0,
      lifecycle: LIFECYCLE.INIT,
      size: 4,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.TOUR_START,
    });
  });

  it('should have rendered the STEP 1 Beacon', () => {
    initPopper(wrapper);

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.START,
      controlled: false,
      index: 0,
      lifecycle: LIFECYCLE.READY,
      size: 4,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.STEP_BEFORE,
    });

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.UPDATE,
      controlled: false,
      index: 0,
      lifecycle: LIFECYCLE.BEACON,
      size: 4,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.BEACON,
    });
  });

  it('should be able to click STEP 1 Beacon', () => {
    wrapper.find('JoyrideBeacon').simulate('click');

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.UPDATE,
      controlled: false,
      index: 0,
      lifecycle: LIFECYCLE.TOOLTIP,
      size: 4,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.TOOLTIP,
    });
    expect(joyride.state).toMatchSnapshot();
  });

  it('should be able to click STEP 1 Skip button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-skip"]').simulate('click');

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.SKIP,
      controlled: false,
      index: 0,
      lifecycle: LIFECYCLE.COMPLETE,
      size: 4,
      status: STATUS.SKIPPED,
      step: expect.any(Object),
      type: EVENTS.STEP_AFTER,
    });
    expect(joyride.state).toMatchSnapshot();
  });

  it('should have ended the tour', () => {
    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.SKIP,
      controlled: false,
      index: 0,
      lifecycle: LIFECYCLE.INIT,
      size: 4,
      status: STATUS.SKIPPED,
      step: expect.any(Object),
      type: EVENTS.TOUR_END,
    });

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.RESET,
      controlled: false,
      index: 0,
      lifecycle: LIFECYCLE.INIT,
      size: 4,
      status: STATUS.READY,
      step: expect.any(Object),
      type: EVENTS.TOUR_STATUS,
    });

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.STOP,
      controlled: false,
      index: 0,
      lifecycle: LIFECYCLE.INIT,
      size: 4,
      status: STATUS.PAUSED,
      step: expect.any(Object),
      type: EVENTS.TOUR_STATUS,
    });
  });

  it('should unmount', () => {
    wrapper.unmount();

    expect(wrapper.find('Joyride')).not.toExist();
  });
});
