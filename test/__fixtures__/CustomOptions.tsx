import { Joyride, type Props, STATUS, type Step } from '~/index';
import { hexToRGB } from '~/modules/helpers';

interface CustomOptionsProps extends Omit<Props, 'steps'> {
  finishedCallback: () => void;
}

function NextWithProgress() {
  return <strong>{`Go ({current} of {total})`}</strong>;
}

function Skip() {
  return <strong data-testid="skip-label">Do you really want to skip?</strong>;
}

const tourSteps: Array<Step> = [
  {
    target: '.projects h2 span',
    placement: 'bottom',
    content: 'The first step of many! Keep walking!',
  },
  {
    target: '.mission h2 span',
    placement: 'bottom',
    content: 'Can be advanced by clicking an element through the overlay hole.',
    title: 'Our Mission',
    showProgress: true,
    locale: {
      nextWithProgress: <NextWithProgress />,
      back: <strong>Go Back</strong>,
      skip: <Skip />,
    },
    arrowBase: 50,
    arrowColor: '#66a5ff',
    arrowSize: 50,
    styles: {
      arrow: {
        color: '#fff',
      },
      buttonPrimary: {
        backgroundColor: '#f04',
      },
    },
  },
  {
    target: '.about h2 span',
    placement: 'bottom',
    content: (
      <div>
        <h3>We are the people</h3>
        <p>Yes, we are, and we are here to make sure all our rights are secure.</p>
      </div>
    ),
  },
  {
    target: '.outro h2 span',
    placement: 'top',
    content: "Text only steps — Because sometimes you don't really need a proper heading",
  },
];

export default function CustomOptions(props: CustomOptionsProps) {
  const { finishedCallback, onEvent, ...rest } = props;

  const handleEvent: Props['onEvent'] = (data, controls) => {
    onEvent?.(data, controls);

    if (data.status === STATUS.FINISHED) {
      finishedCallback();
    }
  };

  return (
    <div data-testid="demo">
      <Joyride
        continuous
        onEvent={handleEvent}
        options={{
          arrowColor: '#5cff47',
          buttons: ['back', 'close', 'primary', 'skip'],
          primaryColor: '#ff0000',
          overlayColor: 'rgba(0, 0, 0, 0.3)',
        }}
        run
        scrollToFirstStep
        steps={tourSteps}
        styles={{
          beaconInner: {
            backgroundColor: '#ffe166',
          },
          beaconOuter: {
            backgroundColor: `rgba(${hexToRGB('#ff5e5e').join(',')}, 0.5)`,
            borderColor: '#a947ff',
          },
          buttonClose: {
            color: '#000',
          },
          buttonPrimary: {
            backgroundColor: '#a947ff',
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
