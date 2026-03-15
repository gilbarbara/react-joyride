import { createRef } from 'react';

import type { MergedProps } from '~/hooks/useTourEngine';
import { ACTIONS, LIFECYCLE, STATUS } from '~/literals';
import createStore from '~/modules/store';
import type { StoreState } from '~/modules/store';
import { cleanup, createStep, fromPartial, render, screen, waitFor } from '~/test-utils';

import TourRenderer from '~/components/TourRenderer';

import type { Controls, StepMerged } from '~/types';

vi.mock('~/hooks/usePortalElement', () => ({
  usePortalElement: () => document.body,
}));

vi.mock('~/components/Step', () => ({
  default: () => <div data-testid="step" />,
}));

vi.mock('~/components/Overlay', () => ({
  default: () => <div data-testid="overlay" />,
}));

const mockControls = fromPartial<Controls>({
  close: vi.fn(),
  next: vi.fn(),
});

const mockMergedProps = fromPartial<MergedProps>({
  continuous: false,
  debug: false,
  portalElement: undefined,
  scrollToFirstStep: false,
});

function createMockStore() {
  return createRef<ReturnType<typeof createStore>>() as { current: ReturnType<typeof createStore> };
}

function createState(overrides: Partial<StoreState> = {}): StoreState {
  return fromPartial<StoreState>({
    action: ACTIONS.UPDATE,
    controlled: false,
    index: 0,
    lifecycle: LIFECYCLE.INIT,
    origin: null,
    positioned: false,
    scrolling: false,
    size: 1,
    status: STATUS.RUNNING,
    waiting: false,
    ...overrides,
  });
}

function renderTourRenderer(overrides: {
  loaderDelay?: number;
  state?: Partial<StoreState>;
  step?: Partial<StepMerged>;
}) {
  const { loaderDelay, state: stateOverrides = {}, step: stepOverrides = {} } = overrides;
  const state = createState(stateOverrides);
  const step = createStep({ loaderDelay: loaderDelay ?? 300, ...stepOverrides });
  const store = createMockStore();

  store.current = fromPartial<ReturnType<typeof createStore>>({
    setPositionData: vi.fn(),
    updateState: vi.fn(),
  });

  return render(
    <TourRenderer
      controls={mockControls}
      mergedProps={mockMergedProps}
      state={state}
      step={step}
      store={store}
    />,
  );
}

describe('TourRenderer', () => {
  afterEach(cleanup);

  describe('loader delay', () => {
    it('should not show loader immediately when loaderDelay > 0', () => {
      renderTourRenderer({
        state: { waiting: true },
        loaderDelay: 200,
      });

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    it('should show loader after loaderDelay', async () => {
      renderTourRenderer({
        state: { waiting: true },
        loaderDelay: 100,
      });

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId('loader')).toBeInTheDocument();
      });
    });

    it('should show loader immediately when loaderDelay is 0', () => {
      renderTourRenderer({
        state: { waiting: true },
        loaderDelay: 0,
      });

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('should not show loader when waiting is false', () => {
      renderTourRenderer({
        state: { waiting: false },
        loaderDelay: 0,
      });

      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  describe('overlay', () => {
    it('should hide overlay when action is START and beacon will show', () => {
      renderTourRenderer({
        state: { action: ACTIONS.START },
      });

      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    it('should show overlay when action is START but beacon is disabled', () => {
      renderTourRenderer({
        state: { action: ACTIONS.START },
        step: { skipBeacon: true },
      });

      expect(screen.getByTestId('overlay')).toBeInTheDocument();
    });

    it('should show overlay when action is START and placement is center', () => {
      renderTourRenderer({
        state: { action: ACTIONS.START },
        step: { placement: 'center' },
      });

      expect(screen.getByTestId('overlay')).toBeInTheDocument();
    });

    it('should show overlay when action is not START', () => {
      renderTourRenderer({
        state: { action: ACTIONS.UPDATE },
      });

      expect(screen.getByTestId('overlay')).toBeInTheDocument();
    });
  });
});
