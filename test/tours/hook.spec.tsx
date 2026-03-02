import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/index';
import {
  act,
  callbackResponseFactory,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '~/test-utils';

import Hook from '../__fixtures__/Hook';

const getCallbackResponse = callbackResponseFactory({ size: 7 });

const mockCallback = vi.fn();

describe('Joyride > Standard With Hook', () => {
  render(<Hook callback={mockCallback} />);

  beforeAll(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    cleanup();
  });

  it('should render the content', () => {
    expect(screen.getByTestId('demo')).toBeInTheDocument();
    expect(mockCallback).toHaveBeenCalledTimes(0);
  });

  it('should start the tour', async () => {
    fireEvent.click(screen.getByTestId('start'));

    expect(mockCallback).toHaveBeenNthCalledWith(
      1,
      getCallbackResponse({
        action: ACTIONS.START,
        index: 0,
        lifecycle: LIFECYCLE.INIT,
        type: EVENTS.TOUR_START,
      }),
    );
  });

  it('should show STEP 1 Tooltip (center placement, no beacon)', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      2,
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 0,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      3,
      getCallbackResponse({
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
      expect(mockCallback).toHaveBeenCalledTimes(6);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      4,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 0,
        lifecycle: LIFECYCLE.COMPLETE,
        type: EVENTS.STEP_AFTER,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      5,
      getCallbackResponse({
        action: ACTIONS.NEXT,
        index: 1,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      6,
      getCallbackResponse({
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

    expect(mockCallback).toHaveBeenNthCalledWith(
      7,
      getCallbackResponse({
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
      expect(mockCallback).toHaveBeenCalledTimes(9);
    });

    expect(mockCallback).toHaveBeenNthCalledWith(
      8,
      getCallbackResponse({
        action: ACTIONS.CLOSE,
        index: 2,
        lifecycle: LIFECYCLE.READY,
        type: EVENTS.STEP_BEFORE,
      }),
    );

    expect(mockCallback).toHaveBeenNthCalledWith(
      9,
      getCallbackResponse({
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

    expect(mockCallback).toHaveBeenNthCalledWith(
      10,
      getCallbackResponse({
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
      expect(mockCallback).toHaveBeenCalledWith(
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
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          action: ACTIONS.SKIP,
          status: STATUS.SKIPPED,
          type: EVENTS.TOUR_END,
        }),
      );
    });
  });
});
