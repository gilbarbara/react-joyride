import { useEffect, useState } from 'react';

import { ACTIONS, EVENTS, LIFECYCLE, STATUS, useJoyride } from '~/index';
import { act, cleanup, fireEvent, render, screen, waitFor } from '~/test-utils';

import type { Controls, Props, Step } from '~/types';

interface FixtureProps extends Omit<Props, 'run' | 'steps'> {
  initialStepIndex?: number;
  onControls?: (controls: Controls) => void;
  steps?: Array<Step>;
}

const defaultSteps: Array<Step> = [
  { target: '.t1', content: 'Step 1' },
  { target: '.t2', content: 'Step 2' },
];

interface ControlledFixtureProps extends Omit<Props, 'run' | 'steps' | 'stepIndex'> {
  onControls?: (controls: Controls) => void;
  startIndex?: number;
  steps?: Array<Step>;
}

function ControlledFixture(props: ControlledFixtureProps) {
  const { onControls, onEvent, startIndex = 0, steps = defaultSteps, ...rest } = props;
  const [stepIndex, setStepIndex] = useState(startIndex);

  const handleEvent: Props['onEvent'] = (data, controls) => {
    if (data.type === EVENTS.STEP_AFTER && data.action === ACTIONS.NEXT) {
      setStepIndex(index => index + 1);
    }

    onEvent?.(data, controls);
  };

  const { controls, Tour } = useJoyride({
    continuous: true,
    portalElement: '#portal',
    run: true,
    stepIndex,
    steps,
    onEvent: handleEvent,
    ...rest,
  });

  useEffect(() => {
    onControls?.(controls);
  }, [controls, onControls]);

  return (
    <>
      {Tour}
      <div data-testid="demo">
        <div className="t1">Target 1</div>
        <div className="t2">Target 2</div>
      </div>
      <div id="portal" />
    </>
  );
}

function Fixture(props: FixtureProps) {
  const { onControls, steps = defaultSteps, ...rest } = props;
  const [run, setRun] = useState(true);

  const { controls, Tour } = useJoyride({
    continuous: true,
    portalElement: '#portal',
    run,
    steps,
    ...rest,
  });

  useEffect(() => {
    onControls?.(controls);
  }, [controls, onControls]);

  return (
    <>
      {Tour}
      <div data-testid="demo">
        <button data-testid="stop" onClick={() => setRun(false)} type="button">
          Stop
        </button>
        <div className="t1">Target 1</div>
        <div className="t2">Target 2</div>
      </div>
      <div id="portal" />
    </>
  );
}

beforeAll(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
});

async function waitForTooltip(testId = 'react-joyride-step-0') {
  await waitFor(() => {
    expect(screen.getById(testId)).toBeInTheDocument();
  });
}

describe('controls.replay > uncontrolled mode', () => {
  it('emits step:after and step:before with action=replay, re-renders tooltip', async () => {
    const onEvent = vi.fn();
    let controls!: Controls;

    render(
      <Fixture
        onControls={c => {
          controls = c;
        }}
        onEvent={onEvent}
        steps={[{ target: '.t1', content: 'Step 1', skipBeacon: true }]}
      />,
    );

    await waitForTooltip();
    onEvent.mockClear();

    act(() => {
      controls.replay('button_close');
    });

    await waitFor(() => {
      expect(onEvent.mock.calls.some(call => call[0].type === EVENTS.TOOLTIP)).toBe(true);
    });

    const types = onEvent.mock.calls.map(call => call[0].type);

    expect(types).toContain(EVENTS.STEP_AFTER);
    expect(types).toContain(EVENTS.STEP_BEFORE);
    expect(types).toContain(EVENTS.TOOLTIP);

    const stepAfter = onEvent.mock.calls.find(call => call[0].type === EVENTS.STEP_AFTER);
    const stepBefore = onEvent.mock.calls.find(call => call[0].type === EVENTS.STEP_BEFORE);

    expect(stepAfter?.[0]).toMatchObject({
      action: ACTIONS.REPLAY,
      index: 0,
      origin: 'button_close',
    });
    expect(stepBefore?.[0]).toMatchObject({
      action: ACTIONS.REPLAY,
      index: 0,
    });
  });

  it('re-runs before hook on every replay', async () => {
    const before = vi.fn(() => Promise.resolve());
    let controls!: Controls;

    render(
      <Fixture
        onControls={c => {
          controls = c;
        }}
        steps={[{ target: '.t1', content: 'Step 1', before, skipBeacon: true }]}
      />,
    );

    await waitForTooltip();

    expect(before).toHaveBeenCalledTimes(1);

    act(() => {
      controls.replay();
    });

    await waitFor(() => {
      expect(before).toHaveBeenCalledTimes(2);
    });
  });

  it('runs after hook on replay-driven exit', async () => {
    const after = vi.fn();
    let controls!: Controls;

    render(
      <Fixture
        onControls={c => {
          controls = c;
        }}
        steps={[{ target: '.t1', content: 'Step 1', after, skipBeacon: true }]}
      />,
    );

    await waitForTooltip();
    expect(after).toHaveBeenCalledTimes(0);

    act(() => {
      controls.replay();
    });

    await waitFor(() => {
      expect(after).toHaveBeenCalledTimes(1);
    });

    expect(after.mock.calls[0][0]).toMatchObject({ action: ACTIONS.REPLAY });
  });

  it('keeps step index unchanged across replay', async () => {
    let controls!: Controls;

    render(
      <Fixture
        initialStepIndex={1}
        onControls={c => {
          controls = c;
        }}
        steps={[
          { target: '.t1', content: 'Step 1', skipBeacon: true },
          { target: '.t2', content: 'Step 2', skipBeacon: true },
        ]}
      />,
    );

    await waitForTooltip('react-joyride-step-1');

    act(() => {
      controls.replay();
    });

    await waitFor(() => {
      expect(controls.info().index).toBe(1);
      expect(controls.info().lifecycle).toBe(LIFECYCLE.TOOLTIP);
    });
  });

  it('does not fire tour:end on replay', async () => {
    const onEvent = vi.fn();
    let controls!: Controls;

    render(
      <Fixture
        onControls={c => {
          controls = c;
        }}
        onEvent={onEvent}
        steps={[{ target: '.t1', content: 'Only step', skipBeacon: true }]}
      />,
    );

    await waitForTooltip();
    onEvent.mockClear();

    act(() => {
      controls.replay();
    });

    await waitFor(() => {
      expect(onEvent.mock.calls.some(call => call[0].type === EVENTS.TOOLTIP)).toBe(true);
    });

    const tourEndCalls = onEvent.mock.calls.filter(call => call[0].type === EVENTS.TOUR_END);

    expect(tourEndCalls).toHaveLength(0);
  });

  it('does not leak action=replay into a subsequent start()', async () => {
    const onEvent = vi.fn();
    let controls!: Controls;

    render(
      <Fixture
        onControls={c => {
          controls = c;
        }}
        onEvent={onEvent}
        steps={[
          { target: '.t1', content: 'Step 1', skipBeacon: true },
          { target: '.t2', content: 'Step 2', skipBeacon: true },
        ]}
      />,
    );

    await waitForTooltip();

    act(() => {
      controls.replay();
    });

    await waitFor(() => {
      expect(onEvent.mock.calls.some(call => call[0].action === ACTIONS.REPLAY)).toBe(true);
    });

    onEvent.mockClear();

    act(() => {
      controls.start(1);
    });

    await waitFor(() => {
      const matches = onEvent.mock.calls.some(
        call => call[0].type === EVENTS.STEP_BEFORE && call[0].index === 1,
      );

      expect(matches).toBe(true);
    });

    const stepBefore = onEvent.mock.calls.find(
      call => call[0].type === EVENTS.STEP_BEFORE && call[0].index === 1,
    );

    expect(stepBefore?.[0].action).not.toBe(ACTIONS.REPLAY);
  });

  it('replays last step without finishing tour', async () => {
    let controls!: Controls;

    render(
      <Fixture
        initialStepIndex={1}
        onControls={c => {
          controls = c;
        }}
        steps={[
          { target: '.t1', content: 'Step 1', skipBeacon: true },
          { target: '.t2', content: 'Last step', skipBeacon: true },
        ]}
      />,
    );

    await waitForTooltip('react-joyride-step-1');

    act(() => {
      controls.replay();
    });

    await waitFor(() => {
      expect(controls.info().lifecycle).toBe(LIFECYCLE.TOOLTIP);
    });

    expect(controls.info().status).toBe(STATUS.RUNNING);
    expect(controls.info().index).toBe(1);
  });
});

describe('controls.replay > target removed mid-replay', () => {
  it('emits target_not_found and auto-advances when target unmounts before replay', async () => {
    const onEvent = vi.fn();
    let controls!: Controls;

    render(
      <Fixture
        onControls={c => {
          controls = c;
        }}
        onEvent={onEvent}
        steps={[
          { target: '.t1', content: 'Step 1', skipBeacon: true, targetWaitTimeout: 0 },
          { target: '.t2', content: 'Step 2', skipBeacon: true },
        ]}
      />,
    );

    await waitForTooltip();

    document.querySelector('.t1')?.remove();

    onEvent.mockClear();

    act(() => {
      controls.replay();
    });

    await waitFor(() => {
      const fired = onEvent.mock.calls.some(call => call[0].type === EVENTS.TARGET_NOT_FOUND);

      expect(fired).toBe(true);
    });

    await waitFor(() => {
      expect(controls.info().index).toBe(1);
    });
  });
});

describe('controls.replay > controlled mode', () => {
  it('replays current step without parent stepIndex change', async () => {
    const onEvent = vi.fn();
    let controls!: Controls;

    render(
      <ControlledFixture
        onControls={c => {
          controls = c;
        }}
        onEvent={onEvent}
        steps={[
          { target: '.t1', content: 'Step 1', skipBeacon: true },
          { target: '.t2', content: 'Step 2', skipBeacon: true },
        ]}
      />,
    );

    await waitForTooltip();
    onEvent.mockClear();

    act(() => {
      controls.replay();
    });

    await waitFor(() => {
      expect(controls.info().lifecycle).toBe(LIFECYCLE.TOOLTIP);
    });

    expect(controls.info().index).toBe(0);

    const stepAfter = onEvent.mock.calls.find(call => call[0].type === EVENTS.STEP_AFTER);

    expect(stepAfter?.[0]).toMatchObject({ action: ACTIONS.REPLAY });
  });
});

describe('controls.replay > step config respect', () => {
  it('skipBeacon: true re-shows tooltip directly without beacon', async () => {
    const onEvent = vi.fn();
    let controls!: Controls;

    render(
      <Fixture
        onControls={c => {
          controls = c;
        }}
        onEvent={onEvent}
        steps={[{ target: '.t1', content: 'Step', skipBeacon: true }]}
      />,
    );

    await waitForTooltip();
    onEvent.mockClear();

    act(() => {
      controls.replay();
    });

    await waitFor(() => {
      expect(onEvent.mock.calls.some(call => call[0].type === EVENTS.TOOLTIP)).toBe(true);
    });

    const beaconCalls = onEvent.mock.calls.filter(call => call[0].type === EVENTS.BEACON);

    expect(beaconCalls).toHaveLength(0);
  });

  it('placement: center re-shows tooltip directly', async () => {
    const onEvent = vi.fn();
    let controls!: Controls;

    render(
      <Fixture
        onControls={c => {
          controls = c;
        }}
        onEvent={onEvent}
        steps={[{ target: 'body', content: 'Modal step', placement: 'center' }]}
      />,
    );

    await waitForTooltip();
    onEvent.mockClear();

    act(() => {
      controls.replay();
    });

    await waitFor(() => {
      expect(onEvent.mock.calls.some(call => call[0].type === EVENTS.TOOLTIP)).toBe(true);
    });

    const beaconCalls = onEvent.mock.calls.filter(call => call[0].type === EVENTS.BEACON);

    expect(beaconCalls).toHaveLength(0);
  });
});

describe('controls.replay > guards', () => {
  it('is a no-op when status is not RUNNING', async () => {
    const onEvent = vi.fn();
    let controls!: Controls;

    render(
      <Fixture
        onControls={c => {
          controls = c;
        }}
        onEvent={onEvent}
        steps={[{ target: '.t1', content: 'Step', skipBeacon: true }]}
      />,
    );

    await waitForTooltip();

    act(() => {
      controls.stop();
    });

    onEvent.mockClear();

    act(() => {
      controls.replay();
    });

    await waitFor(() => Promise.resolve());

    const replayCalls = onEvent.mock.calls.filter(call => call[0].action === ACTIONS.REPLAY);

    expect(replayCalls).toHaveLength(0);
  });

  it('is a no-op when lifecycle is not TOOLTIP', async () => {
    let controls!: Controls;

    render(
      <Fixture
        onControls={c => {
          controls = c;
        }}
        steps={[{ target: '.t1', content: 'Step' }]}
      />,
    );

    await waitFor(() => {
      expect(controls?.info().lifecycle).toBe(LIFECYCLE.BEACON);
    });

    act(() => {
      controls.replay();
    });

    expect(controls.info().action).not.toBe(ACTIONS.REPLAY);
    expect(controls.info().lifecycle).toBe(LIFECYCLE.BEACON);
  });
});

describe('controls.replay > UI wiring', () => {
  it('closeButtonAction: replay triggers replay on close click', async () => {
    const onEvent = vi.fn();

    render(
      <Fixture
        onEvent={onEvent}
        steps={[{ target: '.t1', content: 'Step', skipBeacon: true, closeButtonAction: 'replay' }]}
      />,
    );

    await waitForTooltip();
    onEvent.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => {
      const stepAfter = onEvent.mock.calls.find(call => call[0].type === EVENTS.STEP_AFTER);

      expect(stepAfter?.[0]).toMatchObject({ action: ACTIONS.REPLAY, origin: 'button_close' });
    });
  });

  it('dismissKeyAction: replay triggers replay on ESC', async () => {
    const onEvent = vi.fn();

    render(
      <Fixture
        onEvent={onEvent}
        steps={[{ target: '.t1', content: 'Step', skipBeacon: true, dismissKeyAction: 'replay' }]}
      />,
    );

    await waitForTooltip();
    onEvent.mockClear();

    act(() => {
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    await waitFor(() => {
      const stepAfter = onEvent.mock.calls.find(call => call[0].type === EVENTS.STEP_AFTER);

      expect(stepAfter?.[0]).toMatchObject({ action: ACTIONS.REPLAY, origin: 'keyboard' });
    });
  });

  it('overlayClickAction: replay triggers replay on overlay click', async () => {
    const onEvent = vi.fn();

    render(
      <Fixture
        onEvent={onEvent}
        steps={[{ target: '.t1', content: 'Step', skipBeacon: true, overlayClickAction: 'replay' }]}
      />,
    );

    await waitForTooltip();
    onEvent.mockClear();

    const overlayPath = screen.getByTestId('spotlight').querySelector('path');

    expect(overlayPath).not.toBeNull();
    fireEvent.click(overlayPath!);

    await waitFor(() => {
      const stepAfter = onEvent.mock.calls.find(call => call[0].type === EVENTS.STEP_AFTER);

      expect(stepAfter?.[0]).toMatchObject({ action: ACTIONS.REPLAY, origin: 'overlay' });
    });
  });
});
