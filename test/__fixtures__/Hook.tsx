import { useSetState } from '@gilbarbara/hooks';

import { STATUS, useJoyride } from '../../src';
import { Controls, EventData, Props, Status, Step } from '../../src/types';

import { standardSteps } from './steps';

interface HookProps extends Omit<Props, 'run' | 'steps'> {
  afterHook?: Step['after'];
  beforeHook?: Step['before'];
  onControls?: (controls: Controls) => void;
}

interface State {
  run: boolean;
  steps: Array<Step>;
}

export default function Hook(props: HookProps) {
  const { afterHook, beforeHook, onControls, onEvent, ...rest } = props;
  const [{ run, steps }, setState] = useSetState<State>({
    run: false,
    steps: [
      {
        content: <h2>Let's begin our journey!</h2>,
        locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
        placement: 'center',
        target: 'body',
      },
      standardSteps[0],
      { ...standardSteps[1], before: beforeHook, after: afterHook },
      ...standardSteps.slice(2),
    ],
  });

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as Array<Status>).includes(status)) {
      setState({ run: false });
    }

    onEvent?.(data);
  };

  const { controls, Tour } = useJoyride({
    onEvent: handleJoyrideCallback,
    continuous: true,
    portalElement: '#portal',
    run,
    scrollToFirstStep: true,
    stepOptions: { showSkipButton: true },
    steps,
    ...rest,
  });

  onControls?.(controls);

  const handleClickStart = () => {
    setState({ run: true });
  };

  return (
    <>
      {Tour}
      <div data-testid="demo">
        <main>
          <div className="hero">
            <div className="container">
              <div className="hero__content">
                <h1>
                  <span>Create walkthroughs and guided tours for your ReactJS apps.</span>
                </h1>
                <button data-testid="start" onClick={handleClickStart} type="button">
                  Let's Go!
                </button>
              </div>
            </div>
          </div>
          <div className="demo__section projects">
            <div className="container">
              <h2>
                <span>Projects</span>
              </h2>
              <div className="list">
                <div>Installation</div>
                <div>Documentation</div>
                <div>Support</div>
              </div>
            </div>
          </div>

          <div className="demo__section mission">
            <div className="container">
              <h2>
                <span>Mission</span>
              </h2>
            </div>
          </div>
          <div className="demo__section about">
            <div className="container">
              <h2>
                <span>About</span>
              </h2>
            </div>
          </div>
        </main>
        <footer className="demo__footer">
          <button type="button">Joyride</button>
        </footer>
      </div>
      <div id="portal" />
    </>
  );
}
