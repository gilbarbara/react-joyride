import React from 'react';
import { mount } from 'enzyme';

import Tour from './__fixtures__/Tour';

const props = {
  content: 'Hello! This is my content!',
};

function setup(ownProps = props) {
  return mount(
    <Tour {...ownProps} />,
    { attachTo: document.getElementById('react') }
  );
}

describe('ReactJoyride', () => {
  let joyride;

  describe('basic usage', () => {
    beforeAll(() => {
      joyride = setup();
    });

    it('should render properly', () => {
      expect(joyride.find('Joyride')).toBePresent();
    });
  });
});
