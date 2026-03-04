import { type HTMLAttributes } from 'react';
import Joyride, { type EventData, STATUS, type Step } from 'react-joyride';
import { useMount, useSetState } from '@gilbarbara/hooks';
import { Button, cn, Divider } from '@heroui/react';
// @ts-ignore
import a11yChecker from 'a11y-checker';

import Logo from '../components/Logo';
import StarBurst from '../components/StarBurst';
import { delay, logGroup } from '../modules/helpers';

interface Props {
  breakpoint: string;
}

interface State {
  run: boolean;
  steps: Step[];
}

function Section({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'h-[calc(100lvh-4rem)] flex items-center justify-center px-4 py-8 text-white',
        className,
      )}
      {...props}
    />
  );
}

export default function BasicDemo(props: Props) {
  const { breakpoint } = props;
  const [{ run, steps }, setState] = useSetState<State>({
    run: false,
    steps: [
      {
        content: <h2>Let's begin our journey!</h2>,
        locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
        placement: 'center',
        target: 'body',
      },
      {
        content: <h2>A step with delay (500ms)</h2>,
        target: '.star-burst',
        before: () => delay(500),
      },
      {
        content: 'These are our super awesome projects!',
        placement: 'bottom',
        styles: {
          options: {
            spotlightRadius: 20,
            width: 300,
          },
        },
        spotlightPadding: {
          bottom: 20,
          left: 40,
          right: 40,
          top: 20,
        },
        target: '.demo__projects h2',
        title: 'Our projects',
      },
      {
        content: <h2>Fixed elements and no arrow</h2>,
        target: '#maze',
        floatingOptions: {
          hideArrow: true,
        },
      },
      {
        content: (
          <div>
            You can render anything!
            <br />
            <h3>Like this H3 title</h3>
          </div>
        ),
        placement: 'top',
        target: '.demo__how-it-works h2',
        title: 'Our Mission',
      },
      {
        content: (
          <div>
            <h3>All about us</h3>
            <svg
              height="50px"
              preserveAspectRatio="xMidYMid"
              viewBox="0 0 96 96"
              width="50px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="M83.2922435,72.3864207 C69.5357835,69.2103145 56.7313553,66.4262214 62.9315626,54.7138297 C81.812194,19.0646376 67.93573,0 48.0030634,0 C27.6743835,0 14.1459311,19.796662 33.0745641,54.7138297 C39.4627778,66.4942237 26.1743334,69.2783168 12.7138832,72.3864207 C0.421472164,75.2265157 -0.0385432192,81.3307198 0.0014581185,92.0030767 L0.0174586536,96.0032105 L95.9806678,96.0032105 L95.9966684,92.1270809 C96.04467,81.3747213 95.628656,75.2385161 83.2922435,72.3864207 Z"
                  fill="#000000"
                />
              </g>
            </svg>
          </div>
        ),
        placement: 'left',
        target: '.demo__about h2',
      },
      {
        content: <h2>Let's all folks</h2>,
        placement: 'center',
        target: 'body',
      },
    ],
  });

  useMount(() => {
    a11yChecker();
  });

  const handleClickStart = () => {
    setState({
      run: true,
    });
  };

  const handleEvent = (data: EventData) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setState({ run: false });
    }

    logGroup(type, data);
  };

  return (
    <div className="min-h-[90vh]">
      <Joyride
        continuous
        onEvent={handleEvent}
        run={run}
        scrollOffset={64}
        scrollToFirstStep
        stepOptions={{
          showProgress: true,
          showSkipButton: true,
        }}
        steps={steps}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
      <Section className="demo__hero bg-red">
        <div className="flex flex-col items-center text-white max-w-150 relative">
          <StarBurst>V3</StarBurst>
          <Logo aria-hidden breakpoint={breakpoint} />
          <p className={cn('text-center', breakpoint === 'lg' ? 'text-[32px]' : 'text-lg')}>
            Create guided tours for your apps
          </p>
          <Divider className=" my-4 bg-white" />
          <Button className="bg-white font-bold" onPress={handleClickStart} size="lg">
            Start
          </Button>
        </div>
      </Section>
      <Section className="bg-orange items-start demo__projects">
        <h2 className="text-3xl font-bold">OUR PROJECTS</h2>
      </Section>
      <Section className="bg-green items-start demo__how-it-works">
        <h2 className="text-3xl font-bold">HOW DOES IT WORK</h2>
      </Section>
      <Section className="bg-blue items-start demo__about">
        <h2 className="text-3xl font-bold">ABOUT US</h2>
      </Section>
    </div>
  );
}
