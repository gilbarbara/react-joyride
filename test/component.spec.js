import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Joyride from '../src/scripts/Joyride';

function setup() {
  const props = {
    steps: [
      {
        title: 'Auto Scroll',
        text: 'Scroll to correct position if required. <i>It can be turned off</i>',
        selector: '#area-chart',
        position: 'top'
      },
      {
        title: 'Hide Elements',
        text: 'You can really customize the UI',
        textAlign: 'center',
        selector: '#donut-chart',
        position: 'left'
      }
    ]
  };

  return TestUtils.renderIntoDocument(
    <Joyride {...props} />
  );
}

describe('Joyride', () => {
  const render = setup();

  it('should be a Component', () => {
    expect(TestUtils.isCompositeComponent(render)).toBe(true);
  });
});
