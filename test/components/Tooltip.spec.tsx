import { cleanup, createStep, fireEvent, fromPartial, render, screen } from '~/test-utils';

import { StoreHelpers } from '~/types';

import Tooltip from '../../src/components/Tooltip';
import TooltipComponent from '../__fixtures__/components/Tooltip';

function createHelpers(overrides: Partial<StoreHelpers> = {}) {
  return fromPartial<StoreHelpers>({
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

const setTooltipRefMock = vi.fn();

const step = createStep();

describe('Tooltip', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render "Next" on primary in continuous mode', () => {
    const helpers = createHelpers();

    const { container } = render(
      <Tooltip
        continuous
        helpers={helpers}
        index={0}
        isLastStep={false}
        setTooltipRef={setTooltipRefMock}
        size={3}
        step={step}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render "Last" on primary when isLastStep', () => {
    const helpers = createHelpers();

    const { container } = render(
      <Tooltip
        continuous
        helpers={helpers}
        index={2}
        isLastStep
        setTooltipRef={setTooltipRefMock}
        size={3}
        step={step}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render "Close" on primary in non-continuous mode', () => {
    const helpers = createHelpers();

    const { container } = render(
      <Tooltip
        continuous={false}
        helpers={helpers}
        index={0}
        isLastStep={false}
        setTooltipRef={setTooltipRefMock}
        size={3}
        step={step}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call helpers.next() on primary click in continuous mode', () => {
    const helpers = createHelpers();

    render(
      <Tooltip
        continuous
        helpers={helpers}
        index={0}
        isLastStep={false}
        setTooltipRef={setTooltipRefMock}
        size={3}
        step={step}
      />,
    );

    fireEvent.click(screen.getByTestId('button-primary'));

    expect(helpers.next).toHaveBeenCalledTimes(1);
  });

  it('should call helpers.close on primary click in non-continuous mode', () => {
    const helpers = createHelpers();

    render(
      <Tooltip
        continuous={false}
        helpers={helpers}
        index={0}
        isLastStep={false}
        setTooltipRef={setTooltipRefMock}
        size={3}
        step={step}
      />,
    );

    fireEvent.click(screen.getByTestId('button-primary'));

    expect(helpers.close).toHaveBeenCalledWith('button_primary');
  });

  it('should call helpers.prev() on back click', () => {
    const helpers = createHelpers();

    const { container } = render(
      <Tooltip
        continuous
        helpers={helpers}
        index={1}
        isLastStep={false}
        setTooltipRef={setTooltipRefMock}
        size={3}
        step={step}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();

    fireEvent.click(screen.getByTestId('button-back'));

    expect(helpers.prev).toHaveBeenCalledTimes(1);
  });

  it('should call helpers.close on close button click', () => {
    const helpers = createHelpers();

    render(
      <Tooltip
        continuous
        helpers={helpers}
        index={0}
        isLastStep={false}
        setTooltipRef={setTooltipRefMock}
        size={3}
        step={step}
      />,
    );

    fireEvent.click(screen.getByTestId('button-close'));

    expect(helpers.close).toHaveBeenCalledWith('button_close');
  });

  it('should call helpers.skip() on skip click', () => {
    const helpers = createHelpers();
    const skipStep = createStep({ showSkipButton: true });

    const { container } = render(
      <Tooltip
        continuous
        helpers={helpers}
        index={0}
        isLastStep={false}
        setTooltipRef={setTooltipRefMock}
        size={3}
        step={skipStep}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();

    fireEvent.click(screen.getByTestId('button-skip'));

    expect(helpers.skip).toHaveBeenCalledTimes(1);
  });

  it('should show progress label when showProgress is true', () => {
    const helpers = createHelpers();
    const progressStep = createStep({ showProgress: true });

    const { container } = render(
      <Tooltip
        continuous
        helpers={helpers}
        index={0}
        isLastStep={false}
        setTooltipRef={setTooltipRefMock}
        size={3}
        step={progressStep}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render custom tooltipComponent', () => {
    const helpers = createHelpers();
    const customStep = createStep({ tooltipComponent: TooltipComponent });

    const { container } = render(
      <Tooltip
        continuous
        helpers={helpers}
        index={0}
        isLastStep={false}
        setTooltipRef={setTooltipRefMock}
        size={3}
        step={customStep}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
