import { useRef } from 'react';
import Joyride, { ACTIONS, type CallBackProps, EVENTS, STATUS, type Step } from 'react-joyride';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useElementMeasure, useMount, useSetState } from '@gilbarbara/hooks';
import { Button } from '@heroui/react';
// @ts-ignore
import a11yChecker from 'a11y-checker';

import Container from '~/components/Container';

import { logGroup } from '../modules/helpers';

interface State {
  run: boolean;
  stepIndex: number;
  steps: Step[];
}

const isPortrait = window.innerHeight > window.innerWidth;
const imageHeight = isPortrait ? 700 : 300;
const imageWidth = 1000;
const ratio = imageHeight / imageWidth;
const images = isPortrait
  ? [
      '/images/carousel/1000x700-1.jpg',
      '/images/carousel/1000x700-2.jpg',
      '/images/carousel/1000x700-3.jpg',
      '/images/carousel/1000x700-4.jpg',
      '/images/carousel/1000x700-5.jpg',
    ]
  : [
      '/images/carousel/1000x300-1.jpg',
      '/images/carousel/1000x300-2.jpg',
      '/images/carousel/1000x300-3.jpg',
      '/images/carousel/1000x300-4.jpg',
      '/images/carousel/1000x300-5.jpg',
    ];

export default function CarouselDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useElementMeasure(ref);
  const [{ run, stepIndex, steps }, setState] = useSetState<State>({
    run: false,
    stepIndex: 0,
    steps: [
      {
        content: (
          <>
            <h4 className="font-bold">You can control external widgets</h4>
            <h5>
              (using{' '}
              <a
                aria-label="Open react-modal in a new window"
                href="https://github.com/leandrowd/react-responsive-carousel/"
                rel="noopener noreferrer"
                target="_blank"
              >
                react-responsive-carousel
              </a>
              )
            </h5>
          </>
        ),
        disableBeacon: true,
        target: '.app__carousel',
      },
      {
        content: 'Black and white photos are really beautiful',
        target: '.app__carousel',
        title: 'Image Two',
      },
      {
        content: 'Also known as grayscale',
        target: '.app__carousel',
        title: 'Image Three',
      },
      {
        content: 'Desaturate, Obfuscate',
        target: '.app__carousel',
        title: 'Image Four',
      },
      {
        content: <h4 className="font-bold">Dark days and lonely nights</h4>,
        target: '.app__carousel',
      },
    ],
  });

  useMount(() => {
    a11yChecker();
    setState({ run: true });
  });

  const handleClickReset = () => {
    setState({ run: true, stepIndex: 0 });
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
      // Update state to advance the tour
      setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    } else if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setState({ run: false });
    }

    logGroup(type, data);
  };

  return (
    <div className="bg-warning-50 min-h-screen">
      <Container className="py-8">
        <Joyride
          callback={handleJoyrideCallback}
          continuous
          run={run}
          scrollToFirstStep
          stepIndex={stepIndex}
          stepOptions={{
            showProgress: true,
          }}
          steps={steps}
          styles={{
            options: {
              primaryColor: '#0049DB',
            },
          }}
        />
        <div
          ref={ref}
          className="app__carousel overflow-hidden"
          style={{ height: Math.floor(width * ratio) }}
        >
          <Carousel
            selectedItem={stepIndex}
            showArrows={!run}
            showIndicators={false}
            showStatus={false}
            showThumbs={false}
          >
            <img alt="1" src={images[0]} style={{ cursor: 'pointer' }} />
            <img alt="2" src={images[1]} />
            <img alt="3" src={images[2]} />
            <img alt="4" src={images[3]} />
            <img alt="5" src={images[4]} />
          </Carousel>
        </div>
        {!run && stepIndex > 0 && (
          <div className="flex items-center justify-center mt-8">
            <Button color="primary" onPress={handleClickReset}>
              Restart
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
