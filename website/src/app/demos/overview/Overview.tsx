'use client';

import { useEffect, useMemo, useState } from 'react';
import { type EventData, Joyride, type Props, STATUS, type Step } from 'react-joyride';
import { useMount, useSetState } from '@gilbarbara/hooks';
import { addToast, Button, cn, Divider } from '@heroui/react';
import { XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useConfig } from '~/context/ConfigContext';
import useTheme from '~/hooks/useTheme';
import { delay, getScreenSize, getTourColors, logGroup, mergeProps } from '~/modules/helpers';

import Code from '~/components/Code';
import Logo from '~/components/Logo';
import Maze from '~/components/Maze';
import StarBurst from '~/components/StarBurst';
import Tip from '~/components/Tip';

import About from './About';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Section from './Section';

interface State {
  initialStepIndex: number;
  run: boolean;
  showButtons: boolean;
  showDisableInteraction: boolean;
}

const tourSteps: Step[] = [
  {
    content: (
      <div>
        <Image
          alt="React Joyride V3"
          height={450}
          src="/images/react-joyride-v3.gif"
          unoptimized
          width={800}
        />
      </div>
    ),
    spotlightPadding: { top: 128, bottom: 32, left: 64, right: 64 },
    spotlightRadius: 32,
    placement: 'bottom',
    target: '.demo__hero__content',
    title: 'Welcome to React Joyride',
  },
  {
    before: () => delay(600),
    content: (
      <div>
        <p>
          V3 is a ground-up rewrite shaped by years of community feedback. Simpler internals, better
          DX, and a foundation built for the features you've been asking for.
        </p>
        <Tip iconSize={24}>
          This step has a <Code color="primary">before</Code> hook that added a 600ms delay.
        </Tip>
      </div>
    ),
    spotlightRadius: 128,
    spotlightPadding: 32,
    target: '.star-burst',
  },
  {
    after: () => {
      addToast({
        classNames: {
          closeButton: 'opacity-100 text-black absolute right-4 top-1/2 -translate-y-1/2',
        },
        closeIcon: <XIcon />,
        color: 'success',
        description: 'This toast was triggered by the "after" hook.',
        disableAnimation: true,
        shouldShowTimeoutProgress: false,
        timeout: 5000,
        title: 'Step 3 After hook',
      });
    },
    content: (
      <>
        <p>All the building blocks for guided tour.</p>
        <Tip iconSize={24}>
          This step uses <Code color="primary">scrollTarget</Code> to scroll to the section instead
          of the target.
        </Tip>
      </>
    ),
    placement: 'bottom',
    scrollOffset: 0,
    scrollTarget: '.demo__features',
    skipBeacon: true,
    styles: {
      tooltipContent: {
        paddingTop: 4,
      },
    },
    target: '.demo__features__content',
  },
  {
    content: (
      <>
        <p>You can't interact with this step's target, because it is disabled.</p>
        <Tip iconSize={24}>
          This step's <Code color="primary">blockTargetInteraction</Code> prevents interactions.
        </Tip>
      </>
    ),
    blockTargetInteraction: true,
    id: 'disabled-interaction',
    placement: 'right',
    scrollOffset: 0,
    scrollTarget: '.demo__features',
    skipBeacon: true,
    styles: {
      tooltipContent: {
        paddingTop: 0,
      },
    },
    target: '.demo__feature-card:nth-child(2)',
  },
  {
    content: (
      <>
        <p>Minimal setup. Create a tour in minutes</p>
        <Tip iconSize={24}>
          This step's <Code color="primary">scrollOffset</Code> is set to 0, overriding the global
          value.
        </Tip>
      </>
    ),
    placement: 'top',
    scrollOffset: 0,
    scrollTarget: '.demo__how-it-works',
    styles: {
      tooltipContent: {
        paddingTop: 0,
      },
    },
    target: '.demo__how-it-works__content',
  },
  {
    content: (
      <>
        <p>You can customize the step's placement, scrolling, buttons, and more.</p>
        <Tip iconSize={24}>
          This step uses <Code color="primary">spotlightTarget</Code> to focus the entire section
          instead of the target.
        </Tip>
      </>
    ),
    placement: 'right',
    scrollOffset: 0,
    scrollTarget: '.demo__how-it-works',
    spotlightTarget: '.demo__how-it-works__content',
    styles: {
      tooltipContent: {
        paddingTop: 0,
      },
    },
    target: '.demo__how-it-works-card:nth-child(1)',
  },
  {
    content: (
      <div>
        <p>React 16.8 through 19, fully typed, and trusted by thousands since 2015.</p>
        <Tip iconSize={24}>
          The step <Code color="primary">placement</Code> is set to &quot;left&quot; but
          auto-flipped to fit.
        </Tip>
      </div>
    ),
    placement: 'left',
    scrollOffset: 0,
    scrollTarget: '.demo__about',
    styles: {
      tooltipContent: {
        padding: '0 12px 12px',
      },
    },
    target: '.demo__about__content',
  },
  {
    content: (
      <>
        <p>Works with any layout — fixed, absolute, or sticky.</p>
        <Tip iconSize={24}>Fixed targets are automatically detected.</Tip>
      </>
    ),
    styles: {
      tooltipContent: {
        padding: '0 18px 12px',
      },
    },
    target: '#maze',
  },
  {
    content: (
      <div>
        <p className="text-large font-bold mb-2">Get started with React Joyride</p>
        <p>
          <Link
            className="underline"
            href="https://github.com/gilbarbara/react-joyride"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </Link>
          {' · '}
          <Link className="underline" href="/docs">
            Documentation
          </Link>
        </p>
      </div>
    ),
    placement: 'center',
    styles: {
      tooltipContent: {
        padding: '32px 0',
      },
    },
    target: 'body',
  },
];

export default function Overview() {
  const params = useSearchParams();
  const isE2E = params?.has('e2e') ?? false;
  const withHeader = !isE2E;

  const [breakpoint, setBreakpoint] = useState('lg');

  useEffect(() => {
    const handleResize = () => setBreakpoint(getScreenSize());

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { joyrideProps, registerConfig } = useConfig();
  const [{ initialStepIndex, run, showButtons, showDisableInteraction }, setState] =
    useSetState<State>({
      initialStepIndex: 0,
      run: true,
      showButtons: false,
      showDisableInteraction: false,
    });
  const { isDarkMode } = useTheme();

  const baseProps = useMemo(
    () =>
      ({
        continuous: true,
        options: {
          buttons: ['back', 'close', 'primary', 'skip'],
          overlayClickAction: 'next',
          scrollOffset: 64,
          showProgress: true,
          spotlightPadding: 16,
          spotlightRadius: 16,
          ...getTourColors(isDarkMode),
        },
      }) satisfies Omit<Props, 'steps'>,
    [isDarkMode],
  );

  useMount(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  useEffect(() => {
    registerConfig(baseProps);
  }, [baseProps, registerConfig]);

  const handleClickStart = () => {
    setState({ initialStepIndex: 0, run: true, showButtons: false });
  };

  const handleClickResume = () => {
    setState({ initialStepIndex: 2, run: true, showButtons: false });
  };

  const handleEvent = (data: EventData) => {
    const { status, step, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setState({ run: false, showButtons: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setState({ showDisableInteraction: step.id === 'disabled-interaction' });

    logGroup(type, data);
  };

  return (
    <div className="flex-1">
      <Joyride
        initialStepIndex={initialStepIndex}
        onEvent={handleEvent}
        run={run}
        steps={tourSteps}
        {...mergeProps(baseProps, joyrideProps)}
      />
      <div
        className={cn('fixed top-0 left-0 w-full p-4 z-10', {
          'top-0': !withHeader,
          'top-16': withHeader,
        })}
      >
        <span className="inline-flex" id="maze">
          <Maze color="#fff" size={48} />
        </span>
      </div>

      {/* Hero */}
      <Section className="demo__hero py-16 bg-red" withHeader={withHeader}>
        <div className="demo__hero__content flex flex-col items-center text-white max-w-150 relative">
          <StarBurst>V3</StarBurst>
          <Logo aria-hidden breakpoint={breakpoint} />
          <p className={cn('text-center', breakpoint === 'lg' ? 'text-[32px]' : 'text-lg')}>
            Create guided tours for your apps
          </p>
          <Divider className="my-4 bg-white" />
          <h1 className="text-xl font-bold">Explore the features</h1>
          {showButtons && (
            <div className="flex gap-4 mt-4">
              <Button
                className="bg-white text-black font-bold"
                onPress={handleClickStart}
                size="lg"
              >
                Restart
              </Button>
              <Button
                className="font-bold"
                color="default"
                onPress={handleClickResume}
                size="lg"
                variant="bordered"
              >
                Resume from Features
              </Button>
            </div>
          )}
        </div>
      </Section>
      <Features showDisableInteraction={showDisableInteraction} withHeader={withHeader} />
      <HowItWorks withHeader={withHeader} />
      <About withHeader={withHeader} />
    </div>
  );
}
