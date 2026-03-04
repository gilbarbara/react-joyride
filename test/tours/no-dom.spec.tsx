import React from 'react';

import { fireEvent, render, screen } from '~/test-utils';

import Component from '../__fixtures__/Component';

const mockOnEvent = vi.fn();

vi.mock('~/modules/dom', async () => {
  const originalModule = await vi.importActual('~/modules/dom');

  return {
    ...originalModule,
    canUseDOM: vi.fn().mockImplementation(() => false),
  };
});

describe('Joyride > NO-DOM', () => {
  render(<Component onEvent={mockOnEvent} />);

  it('should not render the step when starting the tour', async () => {
    fireEvent.click(screen.getByTestId('start'));

    expect(screen.queryById('react-joyride-step-0')).not.toBeInTheDocument();

    expect(mockOnEvent).not.toHaveBeenCalled();
  });
});
