import React from 'react';
import { mount } from 'enzyme';

import Demo from '../demo/src/App';
import JoyrideTooltip from '../src/scripts/Tooltip';

const mockConsole = jest.fn();
console.warn = mockConsole; //eslint-disable-line no-console

const mockCallback = jest.fn();
const props = {
  callback: mockCallback,
  run: false
};

function setup(ownProps = props) {
  return mount(
    <Demo joyride={ownProps} />,
    { attachTo: document.getElementById('react') }
  );
}

describe('Joyride', () => {
  let wrapper;

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

  describe('standalone tooltips', () => {
    wrapper = setup();

    afterAll(() => {
      wrapper.detach();
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


    it('should propagate index and steps to tooltip', () => {
      const CustomTooltip = () => <div id="custom-tooltip" />;
      const modifiedWrapper = setup({ ...props, tooltipComponent: CustomTooltip });

      modifiedWrapper.find('.hero__tooltip').instance().dispatchEvent(new Event('click', { bubbles: true }));
      modifiedWrapper.update();

      expect(modifiedWrapper.find(CustomTooltip).prop('index')).toBe(0);
      expect(modifiedWrapper.find(CustomTooltip).prop('steps')).toHaveLength(5);
    });

    it('should render custom tooltip', () => {
      const CustomTooltip = () => <div id="custom-tooltip" />;
      const modifiedWrapper = setup({ ...props, tooltipComponent: CustomTooltip });

      modifiedWrapper.find('.hero__tooltip').instance().dispatchEvent(new Event('click', { bubbles: true }));
      modifiedWrapper.update();

      expect(modifiedWrapper.find(CustomTooltip).exists()).toBe(true);
    });

    it('should render custom beacon', () => {
      const CustomBeacon = () => <div id="custom-beacon" />;
      const modifiedWrapper = setup({ ...props, beaconComponent: CustomBeacon });
      modifiedWrapper.find('.hero__start').simulate('click');

      expect(modifiedWrapper.find(CustomBeacon).exists()).toBe(true);
    });

    it('should render tooltip with render prop', () => {
      const CustomTooltip = tooltipProps => (
        <JoyrideTooltip
          render={(currentProps, tooltipState) => (
            <div>
              <span className="custom-header" style={tooltipState.styles.header}>
                {currentProps.step.title}
              </span>
            </div>)
          }
          {...tooltipProps} />);

      const modifiedWrapper = setup({ ...props, tooltipComponent: CustomTooltip });

      modifiedWrapper.find('.hero__tooltip').instance().dispatchEvent(new Event('click', { bubbles: true }));
      modifiedWrapper.update();

      expect(modifiedWrapper.find(CustomTooltip).exists()).toBe(true);
      expect(modifiedWrapper.find('.custom-header').exists()).toBe(true);
    });
  });

  describe('tour with `run` set to false', () => {
    beforeAll(() => {
      wrapper = setup();
    });

    afterAll(() => {
      wrapper.detach();
    });

    it('should render properly', () => {
      window.dispatchEvent(new Event('touchstart'));

      expect(wrapper.find('.joyride').length).toEqual(1);
      expect(wrapper.find('.demo__footer').length).toEqual(1);
      expect(wrapper.find('.hero').length).toEqual(1);
      expect(wrapper.find('.projects').length).toEqual(1);
      expect(wrapper.find('.mission').length).toEqual(1);
      expect(wrapper.find('.about').length).toEqual(1);
    });

    it('should be able to start the tour', () => {
      wrapper.find('.hero__start').simulate('click');
      expect(wrapper.find('.joyride-beacon').html()).toMatchSnapshot();
      expect(wrapper.instance().joyride.props.stepIndex).toBe(0);
    });

    it('should be able to click the 1st step beacon', () => {
      wrapper.find('.joyride-beacon').simulate('click');

      Element.prototype.clientHeight = 115;
      Element.prototype.clientWidth = 450;
      expect(wrapper.find('.joyride-tooltip').html()).toMatchSnapshot();
    });

    it('should be able to close the 1st step tooltip', () => {
      wrapper.find('.joyride-tooltip__close').simulate('click');

      expect(wrapper.instance().joyride.props.stepIndex).toBe(1);
      expect(wrapper.find('.joyride-tooltip').length).toBe(0);
      expect(wrapper.find('.joyride-beacon').length).toBe(1);
    });

    it('should be able to click the 2nd step beacon', () => {
      wrapper.find('.joyride-beacon').simulate('click');

      Element.prototype.clientHeight = 115;
      Element.prototype.clientWidth = 450;
      expect(wrapper.find('.joyride-tooltip').html()).toMatchSnapshot();
    });

    it('should be able to advance to the 3rd step by clicking the button inside the hole', () => {
      wrapper.find('.mission button').simulate('click');

      expect(wrapper.instance().joyride.props.stepIndex).toBe(3);
      expect(wrapper.find('.joyride-tooltip').length).toBe(1);
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

      expect(wrapper.instance().joyride.props.stepIndex).toBe(4);
      expect(wrapper.find('.joyride-tooltip').length).toBe(0);
      expect(wrapper.find('.joyride-beacon').length).toBe(1);
    });

    it('should be able to click the 5th step beacon', () => {
      wrapper.find('.joyride-beacon').simulate('click');

      Element.prototype.clientHeight = 115;
      Element.prototype.clientWidth = 450;
      expect(wrapper.find('.joyride-tooltip').html()).toMatchSnapshot();
    });

    it('should be able to close the 5th step tooltip', () => {
      wrapper.find('.joyride-tooltip__close').simulate('click');

      expect(wrapper.instance().joyride.props.stepIndex).toBe(4);
      expect(wrapper.find('.joyride-tooltip').length).toBe(0);
      expect(wrapper.find('.joyride-beacon').length).toBe(0);
    });
  });

  describe('tour with `run` set to true and `type` to "single"', () => {
    beforeAll(() => {
      wrapper = setup({
        ...props,
        run: true,
        resizeDebounce: true,
        type: 'single'
      });
    });

    afterAll(() => {
      wrapper.detach();
    });

    it('should have started with a beacon', () => {
      expect(wrapper.find('Joyride').length).toBe(1);
      expect(wrapper.find('JoyrideBeacon').length).toBe(1);
    });

    it('should be able to open the 1st tooltip', () => {
      wrapper.find('JoyrideBeacon').simulate('click');

      expect(wrapper.find('JoyrideBeacon').length).toBe(0);
      expect(wrapper.find('JoyrideTooltip').length).toBe(1);
      expect(wrapper.find('.joyride-tooltip').html()).toMatchSnapshot();
    });
  });
});
