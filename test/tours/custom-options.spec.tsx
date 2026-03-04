import { cleanup, fireEvent, render, screen, waitFor } from '~/test-utils';

import Customized from '../__fixtures__/CustomOptions';

const mockFinishedCallback = vi.fn();
const mockOnPosition = vi.fn();

const props = {
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
      expect(screen.getByTestId('button-beacon')).toBeInTheDocument();
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

    fireEvent.click(screen.getByTestId('spotlight').querySelector('path')!);

    await waitFor(() => {
      expect(screen.getByTestId('button-beacon')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    expect(screen.getById('react-joyride-step-2')).toMatchSnapshot();
  });

  it('should handle clicking the Close button', async () => {
    fireEvent.click(screen.getByTestId('button-close'));

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('should pause and restart the tour via run prop', async () => {
    rerender(<Customized {...props} run={false} />);

    await waitFor(() => {
      expect(screen.queryByTestId('button-beacon')).not.toBeInTheDocument();
    });

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();

    rerender(<Customized {...props} run />);

    await waitFor(() => {
      expect(screen.getByTestId('button-beacon')).toBeInTheDocument();
    });
  });

  it('should end the tour and call finishedCallback', async () => {
    // Advance: step 4 beacon → tooltip → primary
    fireEvent.click(screen.getByTestId('button-beacon'));

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('button-primary'));

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    expect(mockFinishedCallback).toHaveBeenCalledTimes(1);
  });

  it('should have called onPosition', () => {
    expect(mockOnPosition).toHaveBeenCalledTimes(8);
  });
});
