import React from 'react';
import { mount } from 'enzyme';

import Standard from '../__fixtures__/Standard';

jest.mock('exenv', () => ({
  canUseDOM: false,
}));

console.warn = jest.fn();

const mockCallback = jest.fn();
const props = {
  callback: mockCallback,
};

describe('Joyride > NO-DOM', () => {
  let wrapper;
  let joyride;

  beforeAll(() => {
    wrapper = mount(
      <Standard {...props} />,
      { attachTo: document.getElementById('react') }
    );
    joyride = wrapper.find('Joyride').instance();
  });

  it('should have initiated the Joyride', () => {
    expect(joyride.state).toMatchSnapshot();
  });

  it('should not be able to start the tour', () => {
    wrapper.find('.hero__start').simulate('click');

    expect(wrapper.find('Joyride > div')).not.toExist();
  });
});
