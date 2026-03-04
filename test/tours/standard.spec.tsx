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

import Standard from '../__fixtures__/Standard';

const getEventResponse = eventResponseFactory({ size: 7 });

const mockOnEvent = vi.fn();
const mockOnPosition = vi.fn();

describe('Joyride > Standard', () => {
  render(<Standard floatingOptions={{ onPosition: mockOnPosition }} onEvent={mockOnEvent} />);

  beforeAll(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    cleanup();
  });

  it('should render the content', () => {
    expect(screen.getByTestId('demo')).toMatchSnapshot();
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

  it('should skip STEP 1 Beacon', async () => {
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

    expect(screen.queryById('react-joyride-step-0-beacon')).not.toBeInTheDocument();
  });

  it('should render STEP 1 Tooltip', async () => {
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-0-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-0')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
  });

  it('should handle clicking STEP 1 Primary button', async () => {
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
  });

  it('should render STEP 2 Tooltip', async () => {
    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(8);
    });

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

    expect(screen.queryById('react-joyride-step-1-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-1')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
  });

  it('should close STEP 2 Tooltip with keyboard', async () => {
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

  it('should render STEP 3 Beacon', async () => {
    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(13);
    });

    expect(screen.getById('react-joyride-step-2-beacon')).toMatchSnapshot();

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

  it('should render STEP 3 Tooltip', async () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-2-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-2')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');

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

  it('should handle clicking STEP 3 Back button', () => {
    fireEvent.click(screen.getByTestId('button-back'));

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      15,
      getEventResponse({
        action: ACTIONS.PREV,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should render STEP 2 Tooltip AGAIN', async () => {
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-1-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-1')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');

    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(19);
    });

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      16,
      getEventResponse({
        action: ACTIONS.PREV,
        index: 1,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      17,
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
      18,
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
      19,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should handle clicking STEP 2 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      20,
      getEventResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        origin: null,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should render STEP 3 Tooltip AGAIN', async () => {
    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(24);
    });

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      21,
      getEventResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      22,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP_BEFORE,
        scroll: expect.any(Object),
        scrolling: true,
        type: EVENTS.SCROLL_START,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      23,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP_BEFORE,
        scroll: expect.any(Object),
        scrolling: true,
        type: EVENTS.SCROLL_END,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      24,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-2-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-2')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
  });

  it('should handle clicking STEP 3 Overlay', async () => {
    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(24);
    });

    fireEvent.click(screen.getByTestId('spotlight').querySelector('path')!);

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      25,
      getEventResponse({
        action: ACTIONS.CLOSE,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        origin: 'overlay',
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should render STEP 4 Beacon', async () => {
    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(29);
    });

    expect(screen.getById('react-joyride-step-3-beacon')).toMatchSnapshot();

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      26,
      getEventResponse({
        action: ACTIONS.CLOSE,
        index: 3,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      27,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.BEACON_BEFORE,
        scroll: expect.any(Object),
        scrolling: true,
        type: EVENTS.SCROLL_START,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      28,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.BEACON_BEFORE,
        scroll: expect.any(Object),
        scrolling: true,
        type: EVENTS.SCROLL_END,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      29,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.BEACON,
        type: EVENTS.BEACON,
      }),
    );
  });

  it('should render STEP 4 Tooltip', async () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(30);
    });

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      30,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );

    expect(screen.queryById('react-joyride-step-3-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-3')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
  });

  it('should handle clicking STEP 4 Primary button and skip missing target', async () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenNthCalledWith(
        31,
        getEventResponse({
          action: ACTIONS.NEXT,
          index: 4,
          lifecycle: LIFECYCLE.READY,
          status: STATUS.RUNNING,
          type: EVENTS.TARGET_NOT_FOUND,
        }),
      );
    });
  });

  it('should render STEP 6 Tooltip', async () => {
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeVisible();
    });

    expect(screen.queryById('react-joyride-step-5-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-5')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      32,
      getEventResponse({
        action: ACTIONS.NEXT,
        index: 5,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      33,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 5,
        lifecycle: LIFECYCLE.TOOLTIP_BEFORE,
        scroll: expect.any(Object),
        scrolling: true,
        type: EVENTS.SCROLL_START,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      34,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 5,
        lifecycle: LIFECYCLE.TOOLTIP_BEFORE,
        scroll: expect.any(Object),
        scrolling: true,
        type: EVENTS.SCROLL_END,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      35,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 5,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should handle clicking STEP 6 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      36,
      getEventResponse({
        action: ACTIONS.NEXT,
        index: 5,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.RUNNING,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should render STEP 7 Tooltip', async () => {
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-6-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-6')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      37,
      getEventResponse({
        action: ACTIONS.NEXT,
        index: 6,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      38,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 6,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  it('should handle clicking STEP 7 Primary button', () => {
    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      39,
      getEventResponse({
        action: ACTIONS.NEXT,
        index: 6,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.RUNNING,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should have ended the tour', async () => {
    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(42);
    });

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      40,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 6,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.FINISHED,
        type: EVENTS.TOUR_END,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      41,
      getEventResponse({
        action: ACTIONS.RESET,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.READY,
        type: EVENTS.TOUR_STATUS,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      42,
      getEventResponse({
        action: ACTIONS.STOP,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.PAUSED,
        type: EVENTS.TOUR_STATUS,
      }),
    );
  });

  it('should have called onPosition', () => {
    expect(mockOnPosition).toHaveBeenCalledTimes(10);
  });

  it('should restart the tour', async () => {
    mockOnEvent.mockClear();

    fireEvent.click(screen.getByTestId('start'));

    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(3);
    });

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-0-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-0')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
  });
});
