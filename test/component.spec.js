import expect from 'expect';
import React from 'react';
import { render } from 'enzyme';

import Demo from './demo/App';

describe('Joyride', () => {
  const demo = render(<Demo />);

  it('should be able to start', () => {
    expect(demo.find('.joyride').length).toEqual(1);
  });
});
