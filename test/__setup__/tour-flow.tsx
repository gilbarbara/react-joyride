import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/index';

import type { Origin } from '~/types';

import { act, eventResponseFactory, fireEvent, screen, waitFor } from './test-utils';

interface TourFlowOptions {
  interactions: TourInteractions;
  mockAfter: ReturnType<typeof vi.fn>;
  mockBefore: ReturnType<typeof vi.fn>;
  mockOnEvent: ReturnType<typeof vi.fn>;
}

export interface TourInteractions {
  close: (origin?: Origin | null) => void;
  next: () => void;
  openTooltip: () => void;
  prev: () => void;
  skip: (origin?: Origin) => void;
  start: () => void;
  supportsUIGuards: boolean;
}

export function registerTourFlowTests(options: TourFlowOptions): void {
  const { interactions, mockAfter, mockBefore, mockOnEvent } = options;
  const getEventResponse = eventResponseFactory({ size: 7 });

  // ─── TOUR 1: ends in SKIPPED via dismissAction ───

  test('should render the content', () => {
    expect(screen.getByTestId('demo')).toMatchSnapshot();

    expect(mockOnEvent).toHaveBeenCalledTimes(0);
  });

  test('should start the tour', async () => {
    interactions.start();

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

  test('should skip STEP 1 Beacon', async () => {
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

  test('should render STEP 1 Tooltip', async () => {
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-0-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-0')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
  });

  test('should handle clicking STEP 1 Primary button', async () => {
    interactions.next();

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

  test('should render STEP 2 Tooltip', async () => {
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

  test('should close STEP 2 Tooltip with keyboard', async () => {
    interactions.close('keyboard');

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

  test('should fire STEP 3 before hook and render Beacon', async () => {
    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(14);
    });

    expect(mockBefore).toHaveBeenCalledTimes(1);
    expect(screen.getById('react-joyride-step-2-beacon')).toMatchSnapshot();

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      10,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.INIT,
        type: EVENTS.STEP_BEFORE_HOOK,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      11,
      getEventResponse({
        action: ACTIONS.CLOSE,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
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
        type: EVENTS.SCROLL_START,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      13,
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
      14,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.BEACON,
        type: EVENTS.BEACON,
      }),
    );
  });

  test('should render STEP 3 Tooltip', async () => {
    interactions.openTooltip();

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-2-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-2')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      15,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  test('should handle clicking STEP 3 Back button', () => {
    interactions.prev();

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      16,
      getEventResponse({
        action: ACTIONS.PREV,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    expect(mockAfter).toHaveBeenCalledTimes(0);
  });

  test('should render STEP 2 Tooltip AGAIN', async () => {
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-1-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-1')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');

    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(20);
    });

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      17,
      getEventResponse({
        action: ACTIONS.PREV,
        index: 1,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
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
        type: EVENTS.SCROLL_START,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      19,
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
      20,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 1,
        lifecycle: LIFECYCLE.TOOLTIP,
        type: EVENTS.TOOLTIP,
      }),
    );
  });

  test('should advance STEP 2 via overlay click (overlayClickBehavior: next)', () => {
    if (interactions.supportsUIGuards) {
      fireEvent.click(screen.getByTestId('spotlight').querySelector('path')!);
    } else {
      interactions.next();
    }

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      21,
      getEventResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.COMPLETE,
        origin: null,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  test('should fire STEP 3 before hook again and render Tooltip', async () => {
    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledTimes(26);
    });

    expect(mockBefore).toHaveBeenCalledTimes(2);

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      22,
      getEventResponse({
        action: ACTIONS.UPDATE,
        index: 2,
        lifecycle: LIFECYCLE.INIT,
        type: EVENTS.STEP_BEFORE_HOOK,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      23,
      getEventResponse({
        action: ACTIONS.NEXT,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      24,
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
      25,
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
      26,
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

  test('should handle clicking STEP 3 Overlay and fire after hook', async () => {
    interactions.close('overlay');

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      27,
      getEventResponse({
        action: ACTIONS.CLOSE,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        origin: 'overlay',
        type: EVENTS.STEP_AFTER,
      }),
    );

    expect(mockOnEvent).toHaveBeenNthCalledWith(
      28,
      getEventResponse({
        action: ACTIONS.CLOSE,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        origin: 'overlay',
        type: EVENTS.STEP_AFTER_HOOK,
      }),
    );

    expect(mockAfter).toHaveBeenCalledTimes(1);
  });

  test('should render STEP 4 Beacon', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('button-beacon')).toBeInTheDocument();
    });

    expect(screen.getById('react-joyride-step-3-beacon')).toMatchSnapshot();
  });

  test('should render STEP 4 Tooltip', async () => {
    interactions.openTooltip();

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-3-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-3')).toMatchSnapshot('tooltip');
    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
  });

  if (interactions.supportsUIGuards) {
    test('should not close STEP 4 Tooltip with keyboard (disableCloseOnEsc)', () => {
      act(() => {
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      });

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    test('should not close STEP 4 Tooltip on overlay click (overlayClickBehavior: false)', () => {
      fireEvent.click(screen.getByTestId('spotlight').querySelector('path')!);

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });
  }

  test('should skip the tour via close button (dismissAction: skip)', async () => {
    interactions.skip('button_close');

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    expect(mockOnEvent).toHaveBeenCalledWith(
      getEventResponse({
        action: ACTIONS.SKIP,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        origin: 'button_close',
        status: STATUS.SKIPPED,
        type: EVENTS.TOUR_END,
      }),
    );
  });

  // ─── TOUR 2: restart and complete to FINISHED ───

  test('should restart the tour after skip', async () => {
    mockOnEvent.mockClear();
    mockBefore.mockClear();
    mockAfter.mockClear();

    interactions.start();

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.queryById('react-joyride-step-0-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-0')).toMatchSnapshot('tooltip');
  });

  test('should advance through STEP 1 and STEP 2', async () => {
    interactions.next();

    await waitFor(() => {
      expect(screen.getById('react-joyride-step-1')).toBeInTheDocument();
    });

    interactions.next();

    await waitFor(() => {
      expect(mockBefore).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getById('react-joyride-step-2')).toBeInTheDocument();
    });
  });

  test('should advance STEP 3 via primary and fire after hook', async () => {
    interactions.next();

    await waitFor(() => {
      expect(mockAfter).toHaveBeenCalledTimes(1);
    });
  });

  if (interactions.supportsUIGuards) {
    test('should render STEP 4 Tooltip again and ignore ESC and overlay', async () => {
      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      act(() => {
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      });

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('spotlight').querySelector('path')!);

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });
  }

  test('should advance STEP 4 via primary button and skip missing target', async () => {
    if (!interactions.supportsUIGuards) {
      await waitFor(() => {
        // eslint-disable-next-line vitest/no-conditional-expect
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });
    }

    interactions.next();

    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          index: 4,
          type: EVENTS.TARGET_NOT_FOUND,
        }),
      );
    });
  });

  test('should render STEP 6 Tooltip', async () => {
    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeVisible();
    });

    expect(screen.queryById('react-joyride-step-5-beacon')).not.toBeInTheDocument();
    expect(screen.getById('react-joyride-step-5')).toMatchSnapshot('tooltip');
  });

  test('should advance to STEP 7 and finish the tour', async () => {
    interactions.next();

    await waitFor(() => {
      expect(screen.getById('react-joyride-step-6')).toBeInTheDocument();
    });

    expect(screen.getById('react-joyride-step-6')).toMatchSnapshot('tooltip');

    interactions.next();

    await waitFor(() => {
      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          status: STATUS.FINISHED,
          type: EVENTS.TOUR_END,
        }),
      );
    });
  });
}
