import { cleanup, createStep, render, screen } from '~/test-utils';

import Loader from '../../src/components/Loader';
import LoaderComponent from '../__fixtures__/components/Loader';

const step = createStep();

describe('Loader', () => {
  afterEach(() => {
    cleanup();
    document.getElementById('joyride-loader-animation')?.remove();
  });

  it('should render the loader with spinner', () => {
    render(<Loader step={step} />);

    expect(screen.getByTestId('loader')).toMatchSnapshot();
  });

  it('should inject CSS keyframes on mount', () => {
    render(<Loader step={step} />);

    const style = document.getElementById('joyride-loader-animation');

    expect(style).toBeInTheDocument();
    expect(style?.textContent).toContain('@keyframes joyride-loader-spin');
  });

  it('should clean up CSS keyframes on unmount', () => {
    render(<Loader step={step} />);

    expect(document.getElementById('joyride-loader-animation')).toBeInTheDocument();

    cleanup();

    expect(document.getElementById('joyride-loader-animation')).not.toBeInTheDocument();
  });

  it('should not duplicate CSS keyframes when already injected', () => {
    const style = document.createElement('style');

    style.id = 'joyride-loader-animation';
    document.head.appendChild(style);

    render(<Loader step={step} />);

    expect(document.querySelectorAll('#joyride-loader-animation')).toHaveLength(1);
  });

  it('should render custom loaderComponent and skip CSS injection', () => {
    render(<Loader step={{ ...step, loaderComponent: LoaderComponent }} />);

    expect(screen.getByTestId('custom-loader')).toMatchSnapshot();
    expect(document.getElementById('joyride-loader-animation')).not.toBeInTheDocument();
  });

  it('should not render when loaderComponent is "null"', () => {
    render(<Loader step={{ ...step, loaderComponent: null }} />);

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });
});
