import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import jsdom from 'jsdom';

import Component from '../lib/scripts/Component';

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

    const renderer = TestUtils.createRenderer();
    renderer.render(<Component { ...props } />);
    const output = renderer.getRenderOutput();

    return {
        props,
        output,
        renderer
    };
}

describe('Component', () => {
    it('should render correctly before calling start', () => {
        const { output } = setup();

        expect(output.props.className).toBe('joyride');
        expect(output.props.children).toEqual([ undefined, undefined ]);
    });
});
