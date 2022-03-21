import React from 'react';

import Controlled from '../__fixtures__/Controlled';

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

function getCallbackResponse(input) {
  return {
    controlled: true,
    size: 7,
    status: STATUS.RUNNING,
    step: expect.any(Object),
    ...input,
  };
}

describe('Joyride > Controlled', () => {
  let wrapper;
  let joyride;

  beforeAll(() => {
    wrapper = mount(<Controlled {...props} />, { attachTo: document.getElementById('react') });
    joyride = wrapper.find('Joyride').instance();
  });

  it('should have initiated the Joyride', () => {
    expect(joyride.state).toMatchSnapshot();
  });

  it('should not have rendered a step', () => {
    expect(wrapper.find('Joyride')).toExist();
    expect(wrapper.find('JoyrideStep')).not.toExist();
  });

  it('should be able to start the tour and render the centered tooltip', () => {
    wrapper.find('.hero__start').simulate('click');

    expect(joyride.state).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      1,
      getCallbackResponse({
        action: ACTIONS.START,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        type: EVENTS.TOUR_START,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      2,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 0,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      3,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    expect(mockCallback).toHaveBeenCalledTimes(3);
  });

  it('should be able to click STEP 1 Primary button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-primary"]').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      4,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
    expect(mockCallback).toHaveBeenCalledTimes(4);
  });

  it('should have rendered the STEP 2 Tooltip', () => {
    initPopper(wrapper);

    expect(joyride.state).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      5,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      6,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    expect(mockCallback).toHaveBeenCalledTimes(6);
  });

  it('should be able to click STEP 2 Primary button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-primary"]').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      7,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
    expect(mockCallback).toHaveBeenCalledTimes(7);
  });

  it('should have rendered the STEP 3 Tooltip', () => {
    initPopper(wrapper);

    expect(joyride.state).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      8,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      9,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    expect(mockCallback).toHaveBeenCalledTimes(9);
  });

  it('should be able to click STEP 3 button through the spotlight', () => {
    wrapper.find('.mission__button').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      10,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
    expect(mockCallback).toHaveBeenCalledTimes(10);
  });

  it('should have rendered the STEP 4 Tooltip', () => {
    initPopper(wrapper);

    expect(joyride.state).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      11,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      12,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    expect(mockCallback).toHaveBeenCalledTimes(12);
  });

  it('should be able to click STEP 4 Back button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-back"]').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      13,
      getCallbackResponse({
        action: ACTIONS.PREV,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    expect(mockCallback).toHaveBeenCalledTimes(13);
  });

  it('should have rendered the STEP 3 Tooltip and advance AGAIN', () => {
    initPopper(wrapper);

    expect(joyride.state).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      14,
      getCallbackResponse({
        action: ACTIONS.PREV,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      15,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    expect(mockCallback).toHaveBeenCalledTimes(15);
  });

  it('should be able to click STEP 3 button through the spotlight AGAIN', () => {
    wrapper.find('.mission__button').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      16,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
    expect(mockCallback).toHaveBeenCalledTimes(16);
  });

  it('should have rendered the STEP 4 Tooltip AGAIN', () => {
    initPopper(wrapper);

    expect(joyride.state).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      17,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      18,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    expect(mockCallback).toHaveBeenCalledTimes(18);
  });

  it('should be able to click STEP 4 Primary button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-primary"]').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      19,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    // includes the target not found error
    expect(mockCallback).toHaveBeenCalledTimes(20);
  });

  it('should have skipped the STEP 5', () => {
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenNthCalledWith(
      20,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 4,
        lifecycle: LIFECYCLE.INIT,
        type: EVENTS.TARGET_NOT_FOUND,
      }),
    );
    expect(mockCallback).toHaveBeenCalledTimes(20);
  });

  it('should have rendered the STEP 6 Tooltip', () => {
    initPopper(wrapper);

    expect(joyride.state).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      21,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 5,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      22,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 5,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    expect(mockCallback).toHaveBeenCalledTimes(22);
  });

  it('should be able to click STEP 6 Primary button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-primary"]').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      23,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 5,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    // includes the centered tooltip changes
    expect(mockCallback).toHaveBeenCalledTimes(25);
  });

  it('should have rendered the STEP 7 centered tooltip', () => {
    initPopper(wrapper);

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      24,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 6,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      25,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 6,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    expect(mockCallback).toHaveBeenCalledTimes(25);
  });

  it('should be able to click STEP 7 Primary button and end the tour', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-primary"]').simulate('click');

    expect(joyride.state).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      26,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 6,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      27,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 6,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.FINISHED,
        type: EVENTS.TOUR_END,
      }),
    );

    expect(mockCallback).toHaveBeenCalledTimes(27);
  });

  it('should unmount', () => {
    wrapper.unmount();

    expect(wrapper.find('Joyride')).not.toExist();
  });
});
