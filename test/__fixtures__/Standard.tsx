import { useRef } from 'react';
import { useSetState } from '@gilbarbara/hooks';

import { standardSteps } from './steps';

import Joyride, { STATUS, StoreHelpers } from '../../src';
import { CallBackProps, Props, Status, Step } from '../../src/types';

interface State {
  index: number;
  run: boolean;
  steps: Array<Step>;
}

export default function Standard(props: Omit<Props, 'run' | 'steps'>) {
  const { callback, ...rest } = props;
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
      ...standardSteps,
    ],
  });
  const helpersRef = useRef<StoreHelpers>();

  const handleClickStart = () => {
    setState({ run: true });
  };

  const handleClickMissionButton = () => {
    helpersRef.current?.next();
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as Array<Status>).includes(status)) {
      setState({ run: false });
    }

    setState({ index: data.index });

    callback?.(data);
  };

  return (
    <div data-test-id="demo">
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        getHelpers={helpers => {
          helpersRef.current = helpers;
        }}
        run={run}
        scrollToFirstStep
        showSkipButton
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
              <button data-test-id="start" onClick={handleClickStart} type="button">
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

            <button data-test-id="mission-button" onClick={handleClickMissionButton} type="button">
              Click me
            </button>
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
        <div className="container">
          <button type="button">Joyride</button>
        </div>
      </footer>
    </div>
  );
}
