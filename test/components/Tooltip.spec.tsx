import { cleanup, createStep, fireEvent, fromPartial, render, screen } from '~/test-utils';

import Tooltip from '~/components/Tooltip';

import type { Controls } from '~/types';

import TooltipComponent from '../__fixtures__/components/Tooltip';

function createControls(overrides: Partial<Controls> = {}) {
  return fromPartial<Controls>({
    close: vi.fn(),
    go: vi.fn(),
    info: vi.fn(),
    next: vi.fn(),
    open: vi.fn(),
    prev: vi.fn(),
    reset: vi.fn(),
    skip: vi.fn(),
    ...overrides,
  });
}

const step = createStep();

describe('Tooltip', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render "Next" on primary in continuous mode', () => {
    const controls = createControls();

    const { container } = render(
      <Tooltip continuous controls={controls} index={0} isLastStep={false} size={3} step={step} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render "Last" on primary when isLastStep', () => {
    const controls = createControls();

    const { container } = render(
      <Tooltip continuous controls={controls} index={2} isLastStep size={3} step={step} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render "Close" on primary in non-continuous mode', () => {
    const controls = createControls();

    const { container } = render(
      <Tooltip
        continuous={false}
        controls={controls}
        index={0}
        isLastStep={false}
        size={3}
        step={step}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call controls.next() on primary click in continuous mode', () => {
    const controls = createControls();

    render(
      <Tooltip continuous controls={controls} index={0} isLastStep={false} size={3} step={step} />,
    );

    fireEvent.click(screen.getByTestId('button-primary'));

    expect(controls.next).toHaveBeenCalledTimes(1);
  });

  it('should call controls.close on primary click in non-continuous mode', () => {
    const controls = createControls();

    render(
      <Tooltip
        continuous={false}
        controls={controls}
        index={0}
        isLastStep={false}
        size={3}
        step={step}
      />,
    );

    fireEvent.click(screen.getByTestId('button-primary'));

    expect(controls.close).toHaveBeenCalledWith('button_primary');
  });

  it('should call controls.prev() on back click', () => {
    const controls = createControls();

    const { container } = render(
      <Tooltip continuous controls={controls} index={1} isLastStep={false} size={3} step={step} />,
    );

    expect(container.firstChild).toMatchSnapshot();

    fireEvent.click(screen.getByTestId('button-back'));

    expect(controls.prev).toHaveBeenCalledTimes(1);
  });

  it('should call controls.close on close button click', () => {
    const controls = createControls();

    render(
      <Tooltip continuous controls={controls} index={0} isLastStep={false} size={3} step={step} />,
    );

    fireEvent.click(screen.getByTestId('button-close'));

    expect(controls.close).toHaveBeenCalledWith('button_close');
  });

  it('should call controls.skip() on skip click', () => {
    const controls = createControls();
    const skipStep = createStep({ showSkipButton: true });

    const { container } = render(
      <Tooltip
        continuous
        controls={controls}
        index={0}
        isLastStep={false}
        size={3}
        step={skipStep}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();

    fireEvent.click(screen.getByTestId('button-skip'));

    expect(controls.skip).toHaveBeenCalledTimes(1);
  });

  it('should show progress label when showProgress is true', () => {
    const controls = createControls();
    const progressStep = createStep({ showProgress: true });

    const { container } = render(
      <Tooltip
        continuous
        controls={controls}
        index={0}
        isLastStep={false}
        size={3}
        step={progressStep}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render custom tooltipComponent', () => {
    const controls = createControls();
    const customStep = createStep({ tooltipComponent: TooltipComponent });

    const { container } = render(
      <Tooltip
        continuous
        controls={controls}
        index={0}
        isLastStep={false}
        size={3}
        step={customStep}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
