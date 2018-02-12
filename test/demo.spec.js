import React from 'react';
import { mount } from 'enzyme';

import Demo from '../demo/src/App';

const mockConsole = jest.fn();
console.warn = mockConsole; //eslint-disable-line no-console

const mockCallback = jest.fn();
const props = { callback: mockCallback };

function setup(ownProps = props) {
  return mount(
    <Demo joyride={ownProps} />,
    { attachTo: document.getElementById('react') }
  );
}

describe('Joyride', () => {
  let wrapper;
  let joyride;

  beforeAll(() => {
    Element.prototype.clientHeight = 36;
    Element.prototype.clientWidth = 36;

    Element.prototype.getBoundingClientRect = jest.fn(() =>
      ({
        width: 1024,
        height: 600,
        top: 450,
        left: 15,
        bottom: 200,
        right: 100,
      }));

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.demo__footer a { width: 100px; height: 60px; }';
    document.body.appendChild(style);
  });

  afterAll(() => {
    wrapper.detach();
  });

  describe('standalone tooltips', () => {
    beforeAll(() => {
      wrapper = setup();
      joyride = wrapper.find('Joyride').instance();
    });

    it('should be able to trigger the 1st tooltip', () => {
      wrapper.find('.hero__tooltip').instance().dispatchEvent(new Event('click', { bubbles: true }));
      wrapper.update();

      expect(wrapper.find('.joyride-tooltip--standalone').html()).toMatchSnapshot();
    });

    it('should be able to hide the 1st tooltip', () => {
      wrapper.find('.hero__tooltip').instance().dispatchEvent(new Event('click', { bubbles: true }));
      wrapper.update();

      expect(wrapper.find('.joyride-tooltip--standalone').length).toBe(0);
    });

    it('should be able to trigger the 2nd tooltip', () => {
      wrapper.find('.demo__footer img').instance().dispatchEvent(new Event('click', { bubbles: true }));
      wrapper.update();

      expect(wrapper.find('.joyride-tooltip--standalone').html()).toMatchSnapshot();
    });

    it('should be able to hide the 2nd tooltip', () => {
      wrapper.find('.demo__footer img').instance().dispatchEvent(new Event('mouseleave', { bubbles: true }));
      wrapper.update();

      expect(wrapper.find('.joyride-tooltip--standalone').length).toBe(0);
    });
  });

  describe('tour with `type` "single"', () => {
    beforeAll(() => {
      wrapper = setup({
        ...props,
        type: 'single'
      });
      joyride = wrapper.find('Joyride').instance();
    });

    it('should render properly', () => {
      expect(wrapper.find('Joyride').length).toEqual(1);
      expect(wrapper.find('.demo__footer').length).toEqual(1);
      expect(wrapper.find('.hero').length).toEqual(1);
      expect(wrapper.find('.projects').length).toEqual(1);
      expect(wrapper.find('.mission').length).toEqual(1);
      expect(wrapper.find('.about').length).toEqual(1);
    });

    it('should be able to start the tour', () => {
      wrapper.find('.hero__start').simulate('click');

      expect(wrapper.find('JoyrideBeacon').html()).toMatchSnapshot();
      expect(joyride.props.stepIndex).toBe(0);
    });

    it('should be able to click the 1st step beacon', () => {
      wrapper.find('JoyrideBeacon').simulate('click');
      expect(wrapper.find('JoyrideTooltip').html()).toMatchSnapshot();
    });

    it('should be able to close the 1st step tooltip', () => {
      wrapper.find('.joyride-tooltip__close').simulate('click');

      expect(joyride.props.stepIndex).toBe(1);
      expect(wrapper.find('JoyrideTooltip').length).toBe(0);
      expect(wrapper.find('JoyrideBeacon').length).toBe(1);
    });

    it('should be able to click the 2nd step beacon', () => {
      wrapper.find('JoyrideBeacon').simulate('click');

      Element.prototype.clientHeight = 115;
      Element.prototype.clientWidth = 450;
      expect(wrapper.find('JoyrideTooltip').html()).toMatchSnapshot();
    });

    it('should be able to advance to the 3rd step by clicking the button inside the hole', () => {
      wrapper.find('.mission button').simulate('click');

      expect(joyride.props.stepIndex).toBe(3);
      expect(wrapper.find('JoyrideTooltip').length).toBe(1);
    });

    it('should have skipped the missing step', () => {
      expect(mockConsole.mock.calls[0][0]).toBe('Target not mounted');
      expect(mockConsole.mock.calls[0][1]).toEqual({
        title: 'Unmounted target',
        text: 'This step tests what happens when a target is missing',
        selector: '.not-mounted'
      });
    });

    it('should be able to close the 4th step tooltip', () => {
      wrapper.find('.joyride-tooltip__close').simulate('click');

      expect(joyride.props.stepIndex).toBe(4);
      expect(wrapper.find('JoyrideTooltip').length).toBe(0);
      expect(wrapper.find('JoyrideBeacon').length).toBe(1);
    });

    it('should be able to click the 5th step beacon', () => {
      wrapper.find('JoyrideBeacon').simulate('click');

      Element.prototype.clientHeight = 115;
      Element.prototype.clientWidth = 450;
      expect(wrapper.find('JoyrideTooltip').html()).toMatchSnapshot();
    });

    it('should be able to close the 5th step tooltip', () => {
      wrapper.find('.joyride-tooltip__close').simulate('click');

      expect(joyride.props.stepIndex).toBe(4);
      expect(wrapper.find('JoyrideTooltip').length).toBe(0);
      expect(wrapper.find('JoyrideBeacon').length).toBe(0);
    });
  });

  describe('tour with `type` continuous and auto start', () => {
    beforeAll(() => {
      wrapper = setup({
        ...props,
        run: true,
        type: 'continuous'
      });
      joyride = wrapper.find('Joyride').instance();
    });

    it('should have started with a beacon', () => {
      expect(wrapper.find('Joyride').length).toBe(1);
      expect(wrapper.find('JoyrideBeacon').length).toBe(1);
      expect(joyride.props.stepIndex).toBe(0);
    });

    it('should be able to open the 1st tooltip', () => {
      wrapper.find('JoyrideBeacon').simulate('click');

      expect(wrapper.find('JoyrideBeacon').length).toBe(0);
      expect(wrapper.find('JoyrideTooltip').length).toBe(1);

      expect(joyride.state.index).toBe(0);
      expect(joyride.state.isRunning).toBe(true);

      const Tooltip = wrapper.find('JoyrideTooltip');

      expect(Tooltip.find('.joyride-tooltip__header')).toHaveText('Title only steps — As they say: Make the font bigger!');
      expect(Tooltip.find('.joyride-tooltip__main')).toHaveText('');
    });

    it('should be able move to the second step', () => {
      wrapper.find('JoyrideTooltip').find('.joyride-tooltip__button--primary').simulate('click');

      expect(joyride.state.index).toBe(1);
      expect(joyride.state.isRunning).toBe(true);

      const Tooltip = wrapper.find('JoyrideTooltip');

      expect(Tooltip.find('.joyride-tooltip__header')).toHaveText('Our Mission');
      expect(Tooltip.find('.joyride-tooltip__main')).toHaveText('Can be advanced by clicking an element through the overlay hole.');
    });

    it('should be able move to the third step', () => {
      wrapper.find('.mission__button').simulate('click');

      expect(joyride.state.index).toBe(3);
      expect(joyride.state.isRunning).toBe(true);

      const Tooltip = wrapper.find('JoyrideTooltip');

      expect(Tooltip.find('.joyride-tooltip__header')).not.toBePresent();
      expect(Tooltip.find('.joyride-tooltip__main h3')).toHaveText('We are the people');
      expect(Tooltip.find('.joyride-tooltip__main svg')).toBePresent();
    });

    it('should be able to move to the last step', () => {
      wrapper.find('JoyrideTooltip').find('.joyride-tooltip__button--primary').simulate('click');
      expect(joyride.state.index).toBe(4);
      expect(joyride.state.isRunning).toBe(true);

      const Tooltip = wrapper.find('JoyrideTooltip');

      expect(Tooltip.find('.joyride-tooltip__header')).not.toBePresent();
      expect(Tooltip.find('.joyride-tooltip__main')).toHaveText('Text only steps — Because sometimes you don\'t really need a proper heading');
    });

    it('should should be able to end the tour', () => {
      wrapper.find('JoyrideTooltip').find('.joyride-tooltip__button--primary').simulate('click');

      expect(joyride.state.index).toBe(5);
      expect(joyride.state.isRunning).toBe(false);
    });
  });
});
