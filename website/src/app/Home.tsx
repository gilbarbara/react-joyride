'use client';

import { useMemo, useState } from 'react';
import {
  type EventData,
  LIFECYCLE,
  type Props,
  STATUS,
  type Step,
  useJoyride,
} from 'react-joyride';
import { Button, Link } from '@heroui/react';

import { useConfig } from '~/context/ConfigContext';
import useTheme from '~/hooks/useTheme';
import { getTourColors, logGroup } from '~/modules/helpers';
import { localeMessages } from '~/modules/messages';

import Maze from '~/components/Maze';
import PackageManagerSelector from '~/components/PackageManagerSelector';
import Tip from '~/components/Tip';

const features = [
  {
    title: 'Easy Setup',
    description:
      'Add guided tours to your React app with minimal configuration. Just define your steps and go.',
  },
  {
    title: 'Fully Customizable',
    description:
      'Custom components, styles, and behaviors. Use your own beacon, tooltip, or overlay.',
  },
  {
    title: 'Accessible',
    description:
      'Built-in focus trap, keyboard navigation, and ARIA attributes for screen readers.',
  },
  {
    title: 'Event-Driven',
    description:
      'Rich event system for full control over tour flow. Build controlled or uncontrolled tours.',
  },
];

const tourSteps: Step[] = [
  {
    content: (
      <>
        <p>
          React Joyride creates guided tours and walkthroughs for React apps — this page is one of
          them.
        </p>
        <Tip iconSize={24}>Tours start from targets you define with CSS selectors or elements.</Tip>
      </>
    ),
    placement: 'bottom',
    skipBeacon: true,
    spotlightPadding: 0,
    spotlightRadius: 200,
    target: '.home__logo',
    title: 'Welcome',
  },
  {
    content: (
      <>
        <p>Jump into the docs or explore interactive demos that mirror real product UIs.</p>
        <Tip iconSize={24}>
          Continuous tours advance with Next — back, skip, and progress are all options.
        </Tip>
      </>
    ),
    placement: 'bottom',
    skipBeacon: true,
    spotlightPadding: 8,
    spotlightRadius: 16,
    target: '.home__actions',
    title: 'Start exploring',
  },
  {
    content: (
      <>
        <p>Install with your preferred package manager, then define steps and run the tour.</p>
        <Tip iconSize={24}>Switch tabs to copy the matching install command.</Tip>
      </>
    ),
    placement: 'top',
    skipBeacon: true,
    spotlightPadding: 8,
    spotlightRadius: 12,
    target: '.home__install',
    title: 'Install',
  },
  {
    content: (
      <>
        <p>
          Setup, customization, accessibility, and events — the building blocks behind every tour.
        </p>
        <Tip iconSize={24}>Open Demos to see these ideas live in context.</Tip>
      </>
    ),
    placement: 'top',
    skipBeacon: true,
    spotlightPadding: 12,
    spotlightRadius: 16,
    target: '.home__features',
    title: 'Built for production tours',
  },
];

export default function Home() {
  const { isDarkMode } = useTheme();
  const { localeKey } = useConfig();
  const [run, setRun] = useState(false);

  const joyrideOptions = useMemo(
    () =>
      ({
        continuous: true,
        locale: localeMessages[localeKey],
        options: {
          buttons: ['back', 'close', 'primary', 'skip'],
          overlayClickAction: 'close',
          scrollOffset: 80,
          showProgress: true,
          spotlightPadding: 12,
          spotlightRadius: 16,
          ...getTourColors(isDarkMode),
        },
        scrollToFirstStep: true,
        steps: tourSteps,
      }) satisfies Omit<Props, 'onEvent' | 'run'>,
    [isDarkMode, localeKey],
  );

  const { controls, state, Tour } = useJoyride({
    ...joyrideOptions,
    onEvent: (data: EventData) => {
      const { status, type } = data;

      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        setRun(false);
      }

      logGroup(type, data);
    },
    run,
  });

  const tourActive = state.status === STATUS.RUNNING && state.lifecycle === LIFECYCLE.TOOLTIP;

  const handleLogoClick = () => {
    if (tourActive) {
      controls.reset(true);
      return;
    }

    if (run) {
      controls.reset(true);
      return;
    }

    setRun(true);
  };

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,0,68,0.14),transparent_55%),linear-gradient(180deg,transparent_0%,rgba(255,0,68,0.04)_100%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,0,68,0.22),transparent_55%),linear-gradient(180deg,transparent_0%,rgba(255,0,68,0.08)_100%)]">
      {Tour}
      <div className="flex flex-col items-center justify-center text-center w-full max-w-7xl mx-auto py-10 xs:py-16 md:py-28 px-4 sm:px-8 relative">
        <div className="home__brand flex flex-col items-center">
          <button
            aria-label="Start homepage tour"
            className="home__logo home-logo-glow relative mb-8 inline-flex cursor-pointer rounded-full border-0 bg-transparent p-0 outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={handleLogoClick}
            type="button"
          >
            <Maze aria-hidden className="home-maze-enter size-32 md:size-64 pointer-events-none" />
          </button>
          <h1 className="home-enter home-enter-delay-1 text-4xl sm:text-5xl font-bold tracking-tight text-balance mb-3 md:mb-4">
            React Joyride
          </h1>
          <p className="home-enter home-enter-delay-2 text-lg sm:text-xl text-default-600 mb-8 max-w-2xl text-pretty leading-relaxed">
            Create guided tours and walkthroughs for your React apps. Showcase features to new users
            or explain how things work.
          </p>
        </div>
        <div className="home__actions home-enter home-enter-delay-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Button as={Link} color="primary" href="/docs/getting-started" size="lg">
            Get Started
          </Button>
          <Button as={Link} color="primary" href="/demos" size="lg" variant="bordered">
            View Demos
          </Button>
        </div>
        <div className="home__install home-enter home-enter-delay-4 mt-8 w-full max-w-82 flex justify-center">
          <PackageManagerSelector justify="center" />
        </div>
      </div>
      <section
        aria-label="Features"
        className="home__features grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl w-full mx-auto px-4 sm:px-8 pb-16"
      >
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="home-feature-enter p-5 sm:p-6 rounded-lg border border-crimson bg-content1"
            style={{ animationDelay: `${0.45 + index * 0.07}s` }}
          >
            <h2 className="text-lg text-crimson font-semibold mb-2">{feature.title}</h2>
            <p className="text-default-600 text-sm sm:text-base leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
