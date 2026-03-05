import { act, cleanup, fireEvent, render, screen } from '~/test-utils';

import Component from '../__fixtures__/Component';
import { registerTourFlowTests, type TourInteractions } from '../__setup__/tour-flow';

const mockOnEvent = vi.fn();
const mockOnPosition = vi.fn();
const mockBefore = vi.fn(() => Promise.resolve());
const mockAfter = vi.fn();

const interactions: TourInteractions = {
  start: () => fireEvent.click(screen.getByTestId('start')),
  next: () => fireEvent.click(screen.getByTestId('button-primary')),
  prev: () => fireEvent.click(screen.getByTestId('button-back')),
  close: origin => {
    if (origin === 'keyboard') {
      act(() => {
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      });
    } else if (origin === 'overlay') {
      fireEvent.click(screen.getByTestId('spotlight').querySelector('path')!);
    } else {
      fireEvent.click(screen.getByTestId('button-close'));
    }
  },
  skip: () => fireEvent.click(screen.getByTestId('button-close')),
  openTooltip: () => fireEvent.click(screen.getByTestId('button-beacon')),
  supportsUIGuards: true,
};

describe('Joyride > Component', () => {
  render(
    <Component
      afterHook={mockAfter}
      beforeHook={mockBefore}
      floatingOptions={{ onPosition: mockOnPosition }}
      onEvent={mockOnEvent}
    />,
  );

  beforeAll(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    cleanup();
  });

  registerTourFlowTests({
    interactions,
    mockAfter,
    mockBefore,
    mockOnEvent,
  });
});
