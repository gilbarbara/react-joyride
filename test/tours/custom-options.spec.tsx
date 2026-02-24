import { ACTIONS, EVENTS, LIFECYCLE, STATUS } from '~/index';
import { callbackResponseFactory, cleanup, fireEvent, render, screen, waitFor } from '~/test-utils';

import Customized from '../__fixtures__/CustomOptions';

const mockCallback = vi.fn();
const mockFinishedCallback = vi.fn();
const mockOnPosition = vi.fn();

const getCallbackResponse = callbackResponseFactory({ size: 4 });

const props = {
  callback: mockCallback,
  finishedCallback: mockFinishedCallback,
  floatingOptions: {
    onPosition: mockOnPosition,
    styles: {
      arrow: {
        color: '#fff647',
      },
    },
  },
};

describe('Joyride > Custom Options', () => {
  const { rerender } = render(<Customized {...props} />);

  afterAll(() => {
    cleanup();
  });

  it('should render STEP 1 with custom beacon styles', async () => {
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    expect(screen.getByTestId('button-beacon')).toMatchSnapshot();
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
  });

  it('should render STEP 1 Tooltip with custom styles', async () => {
    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.getByTestId('overlay')).toMatchSnapshot('overlay');
    expect(screen.getById('react-joyride-step-0')).toMatchSnapshot('tooltip');
  });

  it('should render STEP 3 Tooltip with custom arrow and locale', async () => {
    // Advance: step 1 primary → step 2 overlay close → step 3
    fireEvent.click(screen.getByTestId('button-primary'));

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('overlay'));

    await waitFor(() => {
      expect(screen.getByTestId('button-beacon')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.getById('react-joyride-step-2')).toMatchSnapshot();
  });

  it('should handle clicking the Close button', () => {
    fireEvent.click(screen.getByTestId('button-close'));

    expect(mockCallback).toHaveBeenCalledWith(
      getCallbackResponse({
        action: ACTIONS.CLOSE,
        index: 2,
        lifecycle: LIFECYCLE.COMPLETE,
        origin: 'button_close',
        status: STATUS.RUNNING,
        type: EVENTS.STEP_AFTER,
      }),
    );
  });

  it('should pause and restart the tour via run prop', () => {
    rerender(<Customized {...props} run={false} />);

    expect(mockCallback).toHaveBeenCalledWith(
      getCallbackResponse({
        action: ACTIONS.STOP,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.PAUSED,
        type: EVENTS.TOUR_STATUS,
      }),
    );

    rerender(<Customized {...props} run />);

    expect(mockCallback).toHaveBeenCalledWith(
      getCallbackResponse({
        action: ACTIONS.START,
        index: 3,
        lifecycle: LIFECYCLE.INIT,
        status: STATUS.RUNNING,
        type: EVENTS.TOUR_START,
      }),
    );
  });

  it('should end the tour and call finishedCallback', async () => {
    // Advance: step 4 beacon → tooltip → primary
    await waitFor(() => {
      expect(screen.getByTestId('button-beacon')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockCallback).toHaveBeenCalledWith(
      getCallbackResponse({
        action: ACTIONS.UPDATE,
        index: 3,
        lifecycle: LIFECYCLE.COMPLETE,
        status: STATUS.FINISHED,
        type: EVENTS.TOUR_END,
      }),
    );

    expect(mockFinishedCallback).toHaveBeenCalledTimes(1);
  });

  it('should have called onPosition', () => {
    expect(mockOnPosition).toHaveBeenCalledTimes(8);
  });
});
