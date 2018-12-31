import React from 'react';
import { mount } from 'enzyme';

import Controlled from '../__fixtures__/Controlled';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '../../src';

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  return class {
    static placements = PopperJS.placements;

    constructor() {
      return {
        destroy: () => { },
        scheduleUpdate: () => { },
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

describe('Joyride > Controlled', () => {
  let wrapper;
  let joyride;

  beforeAll(() => {
    wrapper = mount(
      <Controlled {...props} />,
      { attachTo: document.getElementById('react') }
    );
    joyride = wrapper.find('Joyride').instance();
  });

  it('should have initiated the Joyride', () => {
    expect(joyride.state).toMatchSnapshot();
  });

  it('should not have rendered a step', () => {
    expect(wrapper.find('Joyride')).toExist();
    expect(wrapper.find('JoyrideStep')).not.toExist();
  });

  it('should be able to start the tour', () => {
    wrapper.find('.hero__start').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.START,
      controlled: true,
      index: 0,
      lifecycle: LIFECYCLE.INIT,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.TOUR_START,
    });
  });

  it('should have rendered the STEP 1 Beacon', () => {
    initPopper(wrapper);

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.START,
      controlled: true,
      index: 0,
      lifecycle: LIFECYCLE.READY,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.STEP_BEFORE,
    });

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.UPDATE,
      controlled: true,
      index: 0,
      lifecycle: LIFECYCLE.BEACON,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.BEACON,
    });
  });

  it('should be able to click STEP 1 Beacon', () => {
    wrapper.find('JoyrideBeacon').simulate('click');

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.UPDATE,
      controlled: true,
      index: 0,
      lifecycle: LIFECYCLE.TOOLTIP,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.TOOLTIP,
    });
    expect(joyride.state).toMatchSnapshot();
  });

  it('should be able to click STEP 1 Primary button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-primary"]').simulate('click');

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.NEXT,
      controlled: true,
      index: 0,
      lifecycle: LIFECYCLE.COMPLETE,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.STEP_AFTER,
    });
    expect(joyride.state).toMatchSnapshot();
  });

  it('should have rendered the STEP 2 Tooltip', () => {
    initPopper(wrapper);

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.NEXT,
      controlled: true,
      index: 1,
      lifecycle: LIFECYCLE.READY,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.STEP_BEFORE,
    });

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.UPDATE,
      controlled: true,
      index: 1,
      lifecycle: LIFECYCLE.TOOLTIP,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.TOOLTIP,
    });
  });

  it('should be able to click STEP 2 button through the spotlight', () => {
    wrapper.find('.mission__button').simulate('click');

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.NEXT,
      controlled: true,
      index: 1,
      lifecycle: LIFECYCLE.COMPLETE,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.STEP_AFTER,
    });
    expect(joyride.state).toMatchSnapshot();
  });

  it('should have rendered the STEP 3 Tooltip', () => {
    initPopper(wrapper);

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.NEXT,
      controlled: true,
      index: 2,
      lifecycle: LIFECYCLE.READY,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.STEP_BEFORE,
    });

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.UPDATE,
      controlled: true,
      index: 2,
      lifecycle: LIFECYCLE.TOOLTIP,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.TOOLTIP,
    });
    expect(joyride.state).toMatchSnapshot();
  });

  it('should be able to click STEP 3 Back button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-back"]').simulate('click');

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.PREV,
      controlled: true,
      index: 2,
      lifecycle: LIFECYCLE.COMPLETE,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.STEP_AFTER,
    });
    expect(joyride.state).toMatchSnapshot();
  });

  it('should have rendered the STEP 2 Tooltip and advance AGAIN', () => {
    initPopper(wrapper);

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.PREV,
      controlled: true,
      index: 1,
      lifecycle: LIFECYCLE.READY,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.STEP_BEFORE,
    });

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.UPDATE,
      controlled: true,
      index: 1,
      lifecycle: LIFECYCLE.TOOLTIP,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.TOOLTIP,
    });
  });

  it('should be able to click STEP 2 button through the spotlight AGAIN', () => {
    wrapper.find('.mission__button').simulate('click');

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.NEXT,
      controlled: true,
      index: 1,
      lifecycle: LIFECYCLE.COMPLETE,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.STEP_AFTER,
    });
    expect(joyride.state).toMatchSnapshot();
  });

  it('should have rendered the STEP 3 Tooltip AGAIN', () => {
    initPopper(wrapper);

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.NEXT,
      controlled: true,
      index: 2,
      lifecycle: LIFECYCLE.READY,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.STEP_BEFORE,
    });

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.UPDATE,
      controlled: true,
      index: 2,
      lifecycle: LIFECYCLE.TOOLTIP,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.TOOLTIP,
    });
    expect(joyride.state).toMatchSnapshot();
  });

  it('should be able to click STEP 3 Primary button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-primary"]').simulate('click');

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.NEXT,
      controlled: true,
      index: 2,
      lifecycle: LIFECYCLE.COMPLETE,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.STEP_AFTER,
    });
    expect(joyride.state).toMatchSnapshot();
  });

  it('should have skipped the STEP 4', () => {
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.NEXT,
      controlled: true,
      index: 3,
      lifecycle: LIFECYCLE.INIT,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.TARGET_NOT_FOUND,
    });
  });

  it('should have rendered the STEP 5 Tooltip', () => {
    initPopper(wrapper);

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.NEXT,
      controlled: true,
      index: 4,
      lifecycle: LIFECYCLE.READY,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.STEP_BEFORE,
    });

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.UPDATE,
      controlled: true,
      index: 4,
      lifecycle: LIFECYCLE.TOOLTIP,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.TOOLTIP,
    });
    expect(joyride.state).toMatchSnapshot();
  });

  it('should be able to click STEP 5 Primary button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-primary"]').simulate('click');

    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.NEXT,
      controlled: true,
      index: 4,
      lifecycle: LIFECYCLE.COMPLETE,
      size: 5,
      status: STATUS.RUNNING,
      step: expect.any(Object),
      type: EVENTS.STEP_AFTER,
    });
    expect(joyride.state).toMatchSnapshot();
  });

  it('should have ended the tour', () => {
    expect(mockCallback).toHaveBeenCalledWith({
      action: ACTIONS.NEXT,
      controlled: true,
      index: 4,
      lifecycle: LIFECYCLE.INIT,
      size: 5,
      status: STATUS.FINISHED,
      step: expect.any(Object),
      type: EVENTS.TOUR_END,
    });
  });

  it('should unmount', () => {
    wrapper.unmount();

    expect(wrapper.find('Joyride')).not.toExist();
  });
});
