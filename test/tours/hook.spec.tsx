import { act, cleanup, fireEvent, render, screen } from '~/test-utils';

import { Controls } from '~/types';

import Hook from '../__fixtures__/Hook';
import { registerTourFlowTests, TourInteractions } from '../__setup__/tour-flow';

const mockOnEvent = vi.fn();
const mockBefore = vi.fn(() => Promise.resolve());
const mockAfter = vi.fn();

let tourControls: Controls;

const interactions: TourInteractions = {
  start: () => fireEvent.click(screen.getByTestId('start')),
  next: () => {
    act(() => {
      tourControls.next();
    });
  },
  prev: () => {
    act(() => {
      tourControls.prev();
    });
  },
  close: origin => {
    act(() => {
      tourControls.close(origin);
    });
  },
  skip: origin => {
    act(() => {
      tourControls.skip(origin as 'button_close' | 'button_skip');
    });
  },
  openTooltip: () => {
    act(() => {
      tourControls.open();
    });
  },
  supportsUIGuards: false,
};

describe('Joyride > Hook', () => {
  render(
    <Hook
      afterHook={mockAfter}
      beforeHook={mockBefore}
      onControls={c => {
        tourControls = c;
      }}
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
