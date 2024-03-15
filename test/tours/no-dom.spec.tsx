import React from 'react';

import Standard from '../__fixtures__/Standard';
import { fireEvent, render, screen } from '../__fixtures__/test-utils';

const mockCallback = vi.fn();

vi.mock('~/modules/dom', async () => {
  const originalModule = await vi.importActual('~/modules/dom');

  return {
    ...originalModule,
    canUseDOM: vi.fn().mockImplementation(() => false),
  };
});

describe('Joyride > NO-DOM', () => {
  render(<Standard callback={mockCallback} />);

  it('should not render the step when starting the tour', async () => {
    fireEvent.click(screen.getByTestId('start'));

    expect(screen.queryById('react-joyride-step-0')).not.toBeInTheDocument();

    expect(mockCallback).not.toHaveBeenCalled();
  });
});
