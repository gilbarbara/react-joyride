import { useSetState } from '@gilbarbara/hooks';

import Joyride, { STATUS } from '~/index';

import type { EventData, Props, Status, Step } from '~/types';

import { standardSteps } from './steps';

interface StandardProps extends Omit<Props, 'run' | 'steps'> {
  afterHook?: Step['after'];
  beforeHook?: Step['before'];
}

interface State {
  index: number;
  run: boolean;
  steps: Array<Step>;
}

export default function Component(props: StandardProps) {
  const { afterHook, beforeHook, onEvent, ...rest } = props;
  const [{ run, steps }, setState] = useSetState<State>({
    index: 0,
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

  const handleClickStart = () => {
    setState({ run: true });
  };

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as Array<Status>).includes(status)) {
      setState({ run: false });
    }

    setState({ index: data.index });

    onEvent?.(data);
  };

  return (
    <>
      <div data-testid="demo">
        <Joyride
          continuous
          onEvent={handleJoyrideCallback}
          portalElement="#portal"
          run={run}
          scrollToFirstStep
          stepOptions={{ showSkipButton: true }}
          steps={steps}
          {...rest}
        />
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
