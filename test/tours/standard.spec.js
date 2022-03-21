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
  withCentered: true,
};

function initPopper(wrapper) {
  const Step = wrapper.find('JoyrideStep').instance();
  Step.setPopper({ popper: {} }, 'wrapper');
  Step.setPopper({ popper: {} }, 'tooltip');
}

function getCallbackResponse(input) {
  return {
    controlled: false,
    size: 5,
    status: STATUS.RUNNING,
    step: expect.any(Object),
    ...input,
  };
}

describe('Joyride > Standard', () => {
  let wrapper;
  let joyride;

  beforeAll(() => {
    wrapper = mount(<Standard {...props} />, { attachTo: document.getElementById('react') });
    joyride = wrapper.find('Joyride').instance();
  });

  it('should have initiated the Joyride', () => {
    expect(joyride.state).toMatchSnapshot();
  });

  it('should not have rendered a step', () => {
    window.dispatchEvent(new Event('resize'));
    expect(wrapper.find('Joyride')).toExist();
    expect(wrapper.find('JoyrideStep')).not.toExist();
  });

  it('should be able to start the tour', () => {
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
  });

  it('should have rendered the STEP 1 Beacon', () => {
    initPopper(wrapper);

    expect(mockCallback).toHaveBeenNthCalledWith(
      2,
      getCallbackResponse({
        action: ACTIONS.START,
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
        lifecycle: LIFECYCLE.BEACON,
        type: EVENTS.BEACON,
      }),
    );
  });

  it('should be able to click STEP 1 Beacon', () => {
    wrapper.find('JoyrideBeacon').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      4,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 1 Primary button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-primary"]').simulate('click');

    window.dispatchEvent(new Event('keydown', { keyCode: 9 }));
    window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 9 }));

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      5,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have rendered the STEP 2 Tooltip', () => {
    initPopper(wrapper);

    expect(mockCallback).toHaveBeenNthCalledWith(
      6,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      7,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 2 Primary button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-primary"]').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      8,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have rendered the STEP 3 Tooltip', () => {
    initPopper(wrapper);

    expect(joyride.state).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      9,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      10,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 3 Back button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-back"]').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      11,
      getCallbackResponse({
        action: ACTIONS.PREV,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have rendered the STEP 2 Tooltip and advance AGAIN', () => {
    initPopper(wrapper);

    expect(mockCallback).toHaveBeenNthCalledWith(
      12,
      getCallbackResponse({
        action: ACTIONS.PREV,
        index: 1,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      13,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 2 Primary button AGAIN', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-primary"]').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      14,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have rendered the STEP 3 Tooltip AGAIN', () => {
    initPopper(wrapper);

    expect(joyride.state).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      15,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      16,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 3 Primary button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-primary"]').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      17,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have rendered the STEP 4 Tooltip', () => {
    initPopper(wrapper);

    expect(joyride.state).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      18,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      19,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 4 Primary button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-primary"]').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      20,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have rendered the STEP 5 Tooltip', () => {
    initPopper(wrapper);

    expect(joyride.state).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      21,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 4,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      22,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 4,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should be able to click STEP 5 Primary button', () => {
    wrapper.find('JoyrideTooltip [data-test-id="button-primary"]').simulate('click');

    expect(joyride.state).toMatchSnapshot();
    expect(mockCallback).toHaveBeenNthCalledWith(
      23,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 4,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.FINISHED,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have ended the tour', () => {
    expect(joyride.state).toMatchSnapshot();

    expect(mockCallback).toHaveBeenNthCalledWith(
      24,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 4,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.FINISHED,
        type: EVENTS.TOUR_END,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      25,
      getCallbackResponse({
        action: ACTIONS.RESET,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.READY,
        type: EVENTS.TOUR_STATUS,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      26,
      getCallbackResponse({
        action: ACTIONS.STOP,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.PAUSED,
        type: EVENTS.TOUR_STATUS,
      }),
    );
  });

  it('should unmount', () => {
    wrapper.unmount();

    expect(wrapper.find('Joyride')).not.toExist();
  });
});
