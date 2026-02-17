import { cleanup, createStep, fireEvent, render, screen, waitFor } from '~/test-utils';

import Beacon from '../../src/components/Beacon';
import BeaconComponent from '../__fixtures__/components/Beacon';

const step = createStep();
const defaultProps = {
  continuous: true,
  index: 0,
  isLastStep: false,
  locale: step.locale,
  onClickOrHover: vi.fn(),
  shouldFocus: false,
  size: 3,
  step,
  styles: step.styles,
};

describe('Beacon', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    document.getElementById('joyride-beacon-animation')?.remove();
  });

  it('should render the default beacon with correct structure', () => {
    render(<Beacon {...defaultProps} />);

    expect(screen.getByTestId('button-beacon')).toMatchSnapshot();
  });

  it('should inject CSS keyframes on mount', () => {
    render(<Beacon {...defaultProps} />);

    expect(document.getElementById('joyride-beacon-animation')).toBeInTheDocument();
  });

  it('should clean up CSS keyframes on unmount', () => {
    render(<Beacon {...defaultProps} />);

    expect(document.getElementById('joyride-beacon-animation')).toBeInTheDocument();

    cleanup();

    expect(document.getElementById('joyride-beacon-animation')).not.toBeInTheDocument();
  });

  it('should not duplicate CSS keyframes when already injected', () => {
    const style = document.createElement('style');

    style.id = 'joyride-beacon-animation';
    document.head.appendChild(style);

    render(<Beacon {...defaultProps} />);

    expect(document.querySelectorAll('#joyride-beacon-animation')).toHaveLength(1);
  });

  it('should set nonce attribute on style element', () => {
    render(<Beacon {...defaultProps} nonce="test-nonce" />);

    const style = document.getElementById('joyride-beacon-animation');

    expect(style).toBeInTheDocument();
    expect(style?.getAttribute('nonce')).toBe('test-nonce');
  });

  it('should call onClickOrHover on click', () => {
    render(<Beacon {...defaultProps} />);

    fireEvent.click(screen.getByTestId('button-beacon'));

    expect(defaultProps.onClickOrHover).toHaveBeenCalledTimes(1);
  });

  it('should call onClickOrHover on mouseenter', () => {
    render(<Beacon {...defaultProps} />);

    fireEvent.mouseEnter(screen.getByTestId('button-beacon'));

    expect(defaultProps.onClickOrHover).toHaveBeenCalledTimes(1);
  });

  it('should render custom beaconComponent and skip CSS injection', () => {
    render(<Beacon {...defaultProps} beaconComponent={BeaconComponent} />);

    expect(screen.getByTestId('button-beacon')).toMatchSnapshot();
    expect(document.getElementById('joyride-beacon-animation')).not.toBeInTheDocument();
  });

  it('should focus beacon when shouldFocus is true', async () => {
    render(<Beacon {...defaultProps} shouldFocus />);

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByTestId('button-beacon'));
    });
  });
});
