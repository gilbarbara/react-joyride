/**
 * @vitest-environment node
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import Component from '../__fixtures__/Component';

describe('Joyride > SSR', () => {
  it('should render without errors', async () => {
    const view = renderToStaticMarkup(<Component />);

    expect(view).toMatchSnapshot();
  });
});
