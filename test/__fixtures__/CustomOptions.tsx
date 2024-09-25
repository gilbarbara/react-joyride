import { useSetState } from '@gilbarbara/hooks';

import { standardSteps } from './steps';

import Joyride, { CallBackProps, Props, STATUS, Step } from '../../src';

interface CustomOptionsProps extends Omit<Props, 'steps'> {
  finishedCallback: () => void;
}

interface State {
  index: number;
  steps: Array<Step>;
}

function Skip() {
  return <strong data-test-id="skip-label">Do you really want to skip?</strong>;
}

function NextWithProgress() {
  return <strong>{`Go ({step} of {steps})`}</strong>;
}

const tourSteps: Array<Step> = [
  ...standardSteps.slice(0, 3).map(step => {
    if (step.target === '.mission button') {
      return {
        ...step,
        showProgress: true,
        locale: {
          nextLabelWithProgress: <NextWithProgress />,
          back: <strong>Go Back</strong>,
          skip: <Skip />,
        },
        target: '.mission h2 span',
      };
    }

    return step;
  }),
  {
    target: '.outro h2 span',
    placement: 'top',
    content: "Text only steps — Because sometimes you don't really need a proper heading",
  },
];

export default function CustomOptions(props: CustomOptionsProps) {
  const { callback, finishedCallback, ...rest } = props;
  const [{ steps }, setState] = useSetState<State>({
    index: 0,
    steps: tourSteps,
  });

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    setState({ index: data.index });

    callback?.(data);

    if (status === STATUS.FINISHED) {
      finishedCallback();
    }
  };

  return (
    <div data-test-id="demo">
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        scrollToFirstStep
        showSkipButton
        steps={steps}
        styles={{
          buttonClose: {
            color: '#000',
          },
          buttonNext: {
            backgroundColor: '#a947ff',
          },
          options: {
            arrowColor: '#5cff47',
            primaryColor: '#ff0000',
            overlayColor: 'rgba(0, 0, 0, 0.3)',
          },
          tooltip: {
            borderRadius: 8,
            padding: 12,
          },
          tooltipContent: {
            padding: '1px 8px',
          },
        }}
        {...rest}
      />
      <main>
        <div className="hero">
          <div className="container">
            <div className="hero__content">
              <h1>
                <span>Create walkthroughs and guided tours for your ReactJS apps.</span>
              </h1>
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
              <div>Support </div>
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
        <div className="demo__section outro">
          <div className="container">
            <h2>
              <span>Outro</span>
            </h2>
          </div>
        </div>
      </main>
    </div>
  );
}
