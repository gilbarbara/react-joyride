/**
 * @jest-environment node
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import Standard from '../__fixtures__/Standard';

describe('Joyride > SSR', () => {
  it('should render without errors', async () => {
    const view = renderToStaticMarkup(<Standard />);

    expect(view).toMatchSnapshot();
  });
});
