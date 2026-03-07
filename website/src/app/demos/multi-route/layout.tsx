'use client';

import { type ReactNode, useCallback, useEffect, useMemo } from 'react';
import { type EventData, EVENTS, Joyride, type Props, STATUS, type Step } from 'react-joyride';
import { useMount, useSetState } from '@gilbarbara/hooks';
import { cn, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useConfig } from '~/context/ConfigContext';
import MultiRouteContext from '~/context/MultiRouteContext';
import { logGroup, mergeProps } from '~/modules/helpers';

import Code from '~/components/Code';
import Tip from '~/components/Tip';

interface State {
  hasNewStep: boolean;
  run: boolean;
  steps: Step[];
}

const links = [
  { label: 'Home', path: '/demos/multi-route' },
  { label: 'Route A', path: '/demos/multi-route/a' },
  { label: 'Route B', path: '/demos/multi-route/b' },
  { label: 'Route C', path: '/demos/multi-route/c' },
];

export default function MultiRouteLayout({ children }: { children: ReactNode }) {
  const { joyrideProps, registerConfig } = useConfig();
  const [{ hasNewStep, run, steps }, setState] = useSetState<State>({
    hasNewStep: false,
    run: false,
    steps: [],
  });
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const isE2E = params?.has('e2e') ?? false;

  const baseProps = useMemo(
    () =>
      ({
        continuous: true,
        options: {
          arrowColor: '#9353d3',
          backgroundColor: '#9353d3',
          buttons: ['primary', 'back'],
          primaryColor: '#000000',
          spotlightPadding: 32,
          spotlightRadius: 24,
          skipBeacon: true,
          textColor: '#ffffff',
        },
        styles: {
          buttonPrimary: {
            color: '#ffffff',
          },
        },
      }) satisfies Omit<Props, 'steps'>,
    [],
  );

  useEffect(() => {
    registerConfig(baseProps);
  }, [baseProps, registerConfig]);

  useMount(() => {
    const queryString = isE2E ? '?e2e=true' : '';

    setState({
      steps: [
        {
          target: '#home',
          content: (
            <>
              <p>This tour spans multiple routes. Click "Next" to navigate to Route A.</p>
              <Tip iconSize={24}>
                Each step uses <Code color="primary">data</Code> to store route paths for
                navigation.
              </Tip>
            </>
          ),
          data: {
            next: `/demos/multi-route/a${queryString}`,
          },
        },
        {
          target: '#routeA',
          content: (
            <>
              <p>The tour waited for this route to load before showing the tooltip.</p>
              <Tip iconSize={24}>
                Joyride automatically waits for the step's <Code color="primary">target</Code> to
                appear in the DOM.
              </Tip>
            </>
          ),
          data: {
            previous: `/demos/multi-route${queryString}`,
            next: `/demos/multi-route/b${queryString}`,
          },
        },
        {
          id: 'routeB',
          target: '#routeB',
          content: (
            <>
              <p>Click the button above to dynamically add a new step to the tour.</p>
              <Tip iconSize={24}>
                You can update <Code color="primary">steps</Code> at any time — even mid-tour.
              </Tip>
            </>
          ),
          data: {
            previous: `/demos/multi-route/a${queryString}`,
          },
        },
      ],
    });
  });

  const handleStart = useCallback(() => {
    setState({ run: true });
  }, [setState]);

  const handleNewStep = useCallback(() => {
    if (hasNewStep) {
      return;
    }

    const queryString = isE2E ? '?e2e=true' : '';

    setState(previousState => ({
      hasNewStep: true,
      steps: [
        ...previousState.steps.map(step =>
          step.id === 'routeB'
            ? {
                ...step,
                content: (
                  <>
                    <p>A new step was added! Click "Next" to navigate to the Tips route.</p>
                    <Tip iconSize={24}>
                      The step with <Code color="primary">id: 'routeB'</Code> was updated and a new
                      step was appended.
                    </Tip>
                  </>
                ),
                data: { ...step.data, next: `/demos/multi-route/c${queryString}` },
              }
            : step,
        ),
        {
          target: '#routeC',
          content: (
            <>
              <p>This step was added dynamically while the tour was running.</p>
              <Tip iconSize={24}>
                Combined with route navigation via <Code color="primary">onEvent</Code>, you can
                build complex multi-page tours.
              </Tip>
            </>
          ),
          data: {
            previous: `/demos/multi-route/b${queryString}`,
          },
        },
      ],
    }));
  }, [hasNewStep, isE2E, setState]);

  const handleEvent = (data: EventData) => {
    const {
      action,
      status,
      step: {
        data: { next, previous },
      },
      type,
    } = data;

    logGroup(type === EVENTS.TOUR_STATUS ? `${type}:${status}` : type, data);

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setState({ run: false });

      return;
    }

    if (type === EVENTS.STEP_AFTER) {
      const isPrevious = action === 'prev';
      const route = isPrevious ? previous : next;

      if (route) {
        router.push(route);
      }
    }
  };

  const { options: overrideOptions, ...restOverrides } = joyrideProps;
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { arrowColor, backgroundColor, primaryColor, textColor, ...safeOptions } =
    overrideOptions ?? {};

  const contextValue = useMemo(
    () => ({ hasNewStep, onStart: handleStart, onNewStep: handleNewStep, run }),
    [hasNewStep, handleStart, handleNewStep, run],
  );

  return (
    <MultiRouteContext.Provider value={contextValue}>
      <div className="bg-secondary-50 dark:bg-secondary-100 flex flex-col flex-1">
        <div className="px-4 py-6 w-full max-w-3xl mx-auto">
          <Navbar isBordered>
            <NavbarContent className="grow-0!" justify="start">
              <NavbarBrand>
                <h1 className="text-center text-2xl font-bold">Multi-route</h1>
              </NavbarBrand>
              <NavbarContent className="ml-8 grow-0" justify="start">
                {links.map(link => {
                  const isActive =
                    link.path === '/demos/multi-route'
                      ? pathname === '/demos/multi-route'
                      : pathname === link.path;

                  return (
                    <NavbarItem key={link.path}>
                      <Link
                        className={cn('no-underline text-foreground', { 'font-bold': isActive })}
                        href={link.path}
                        style={{ textDecoration: 'none' }}
                      >
                        {link.label}
                      </Link>
                    </NavbarItem>
                  );
                })}
              </NavbarContent>
            </NavbarContent>
          </Navbar>
        </div>
        {children}
        <Joyride
          onEvent={handleEvent}
          run={run}
          steps={steps}
          {...mergeProps(baseProps, { ...restOverrides, options: safeOptions })}
        />
      </div>
    </MultiRouteContext.Provider>
  );
}
