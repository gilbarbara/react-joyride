import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/index';
import {
  act,
  cleanup,
  eventResponseFactory,
  fireEvent,
  render,
  screen,
  waitFor,
} from '~/test-utils';

import Hook from '../__fixtures__/Hook';

const getEventResponse = eventResponseFactory({ size: 7 });

const mockOnEvent = vi.fn();

describe('Joyride > Standard With Hook', () => {
  render(<Hook onEvent={mockOnEvent} />);

  beforeAll(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    cleanup();
  });

  it('should render the content', () => {
    expect(screen.getByTestId('demo')).toBeInTheDocument();
    expect(mockOnEvent).toHaveBeenCalledTimes(0);
  });

  it('should start the tour', async () => {
    fireEvent.click(screen.getByTestId('start'));

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      1,
      getEventResponse({
        action: ACTIONS.START,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        type: EVENTS.TOUR_START,
      }),
    );
  });

  it('should show STEP 1 Tooltip (center placement, no beacon)', async () => {
    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(3);
    });

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      2,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 0,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      3,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 0,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });
  });

  it('should advance to STEP 2 via primary button', async () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(8);
    });

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      4,
      getEventResponse({
        action: ACTIONS.NEXT,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      5,
      getEventResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      6,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP_BEFORE,
        scroll: expect.any(Object),
        scrolling: true,
        type: EVENTS.SCROLL_START,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      7,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP_BEFORE,
        scroll: expect.any(Object),
        scrolling: true,
        type: EVENTS.SCROLL_END,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      8,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });
  });

  it('should close STEP 2 with Escape key', async () => {
    act(() => {
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      9,
      getEventResponse({
        action: ACTIONS.CLOSE,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        origin: 'keyboard',
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should show STEP 3 Beacon', async () => {
    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(13);
    });

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      10,
      getEventResponse({
        action: ACTIONS.CLOSE,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      11,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.BEACON_BEFORE,
        scroll: expect.any(Object),
        scrolling: true,
        type: EVENTS.SCROLL_START,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      12,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.BEACON_BEFORE,
        scroll: expect.any(Object),
        scrolling: true,
        type: EVENTS.SCROLL_END,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      13,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.BEACON,
        type: EVENTS.BEACON,
      }),
    );
  });

  it('should open STEP 3 Tooltip on beacon click', async () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      14,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should advance STEP 3 via imperative helpers.next() (mission button click)', async () => {
    fireEvent.click(screen.getByTestId('mission-button'));

    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ACTIONS.NEXT,
          index: 2,
          lifecycle: LIFECYCLE.COMPLETE,
          type: EVENTS.STEP_AFTER,
        }),
      );
    });
  });

  it('should skip the tour', async () => {
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('button-skip'));

    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ACTIONS.SKIP,
          status: STATUS.SKIPPED,
          type: EVENTS.TOUR_END,
        }),
      );
    });
  });
});
