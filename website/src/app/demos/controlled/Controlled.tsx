'use client';

import { useEffect, useMemo, useRef } from 'react';
import { ACTIONS, EVENTS, type Events, type Props, STATUS, useJoyride } from 'react-joyride';
import { useSetState } from '@gilbarbara/hooks';
import { Button, cn } from '@heroui/react';
import { useSearchParams } from 'next/navigation';

import { useConfig } from '~/context/ConfigContext';
import useTheme from '~/hooks/useTheme';
import { delay, getTourColors, logGroup, mergeProps } from '~/modules/helpers';

import Code from '~/components/Code';
import Container from '~/components/Container';
import Tip from '~/components/Tip';

import Calendar from './Calendar';
import Connections from './Connections';
import Growth from './Growth';
import Notifications from './Notifications';
import Users from './Users';

interface State {
  complete: boolean;
  isNotificationsOpen: boolean;
  run: boolean;
  stepIndex: number;
}

export default function Controlled() {
  const params = useSearchParams();
  const withHeader = !params?.has('e2e');
  const { joyrideProps, registerConfig } = useConfig();
  const [{ complete, isNotificationsOpen, run, stepIndex }, setState] = useSetState<State>({
    complete: false,
    isNotificationsOpen: false,
    run: false,
    stepIndex: 0,
  });
  const { isDarkMode } = useTheme();

  const calendarRef = useRef<HTMLDivElement>(null);
  const connectionsRef = useRef<HTMLDivElement>(null);
  const markAsReadRef = useRef<HTMLButtonElement>(null);
  const growthRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const noticationsRef = useRef<HTMLDivElement>(null);
  const usersRef = useRef<HTMLDivElement>(null);

  const baseProps = useMemo(
    () =>
      ({
        continuous: true,
        options: {
          buttons: ['back', 'close', 'primary', 'skip'],
          showProgress: true,
          skipScroll: true,
          ...getTourColors(isDarkMode),
        },
      }) satisfies Omit<Props, 'steps'>,
    [isDarkMode],
  );

  useEffect(() => {
    registerConfig(baseProps);
  }, [baseProps, registerConfig]);

  const { on, Tour } = useJoyride({
    onEvent: data => {
      const { action, index, status, type } = data;

      if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
        // Need to set our running state to false, so we can restart if we click start again.
        setState({ complete: true, run: false, stepIndex: 0 });
      } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as Events[]).includes(type)) {
        const isPrevious = action === ACTIONS.PREV;
        const nextStepIndex = index + (isPrevious ? -1 : 1);

        if (isNotificationsOpen && index === 1) {
          setState({
            isNotificationsOpen: !isPrevious,
            stepIndex: nextStepIndex,
          });
        } else if (isNotificationsOpen && index === 2) {
          setState({
            isNotificationsOpen: isPrevious,
            stepIndex: nextStepIndex,
          });
        } else if (index === 3 && action === ACTIONS.PREV) {
          setState({
            isNotificationsOpen: true,
            stepIndex: nextStepIndex,
          });
        } else {
          // Update state to advance the tour
          setState({
            isNotificationsOpen: false,
            stepIndex: nextStepIndex,
          });
        }
      }

      logGroup(type === EVENTS.TOUR_STATUS ? `${type}:${status}` : type, data);
    },
    run,
    stepIndex,
    steps: [
      {
        before: ({ action }) => delay(action === ACTIONS.PREV ? 300 : 0),
        buttons: [],
        content: (
          <>
            <p>You can interact with your own components through the spotlight.</p>
            <p className="mt-2 font-bold">Click the button above!</p>
            <Tip iconSize={24}>
              This step uses <Code color="primary">skipBeacon</Code> making the tooltip appear
              immediately.
            </Tip>
          </>
        ),
        overlayClickAction: false,
        placement: 'bottom',
        skipBeacon: true,
        target: triggerRef,
        title: 'Notifications Button',
      },
      {
        before: ({ action }) => delay(action === ACTIONS.NEXT ? 300 : 0),
        content: (
          <>
            <p>Your notification feed with recent activity and updates.</p>
            <Tip iconSize={24}>
              This step uses a <Code color="primary">before</Code> hook with a 300ms delay and no
              loader.
            </Tip>
          </>
        ),
        loaderComponent: null,
        placement: 'right',
        skipBeacon: true,
        spotlightPadding: 0,
        target: noticationsRef,
        title: 'Notifications',
      },
      {
        before: ({ action }) => (action === ACTIONS.PREV ? delay(300) : Promise.resolve()),
        content: (
          <>
            <p>Clear your notifications in one click.</p>
            <Tip iconSize={24}>
              Coming back from the next step triggers a <Code color="primary">before</Code> hook
              delay while the notification reopens.
            </Tip>
          </>
        ),
        placement: 'right',
        spotlightPadding: 2,
        skipBeacon: true,
        skipScroll: false,
        target: markAsReadRef,
        title: 'Mark as read',
      },
      {
        before: () => delay(300),
        content: (
          <>
            <p>
              Check team availability at a glance. The notifications closes automatically before
              this step.
            </p>
            <Tip iconSize={24}>
              The <Code color="primary">before</Code> hook adds a delay while the notifications
              closes.
            </Tip>
          </>
        ),
        placement: 'bottom',
        skipBeacon: true,
        target: calendarRef,
        title: 'The schedule',
      },
      {
        content: (
          <>
            <p>Revenue trends over the last 6 months. This step uses left-end placement.</p>
            <Tip iconSize={24}>
              The next step targets a missing element. A loader appears while it waits, then skips
              it after the <Code color="primary">targetWaitTimeout</Code>.
            </Tip>
          </>
        ),
        placement: 'left-end',
        target: growthRef,
        title: 'Our Growth',
      },
      {
        content: 'This step targets a missing element. The tour skips it after a timeout.',
        placement: 'bottom',
        target: () => document.querySelector('#inexistent'),
        targetWaitTimeout: 1500,
        title: 'Missing Target',
      },
      {
        content: (
          <>
            <p>Your active users at a glance. This step uses right placement with a ref target.</p>
            <Tip iconSize={24}>
              All the steps in this tour use a <Code color="primary">React.Ref</Code> as target
              (except the one with a missing target).
            </Tip>
          </>
        ),
        placement: 'right',
        target: usersRef,
        title: 'Our Users',
      },
      {
        content: (
          <>
            <p>Network connections mapped by region.</p>
            <p>This is the final step of the tour.</p>
          </>
        ),
        placement: 'top',
        target: connectionsRef,
      },
    ],
    ...mergeProps(baseProps, joyrideProps),
  });

  useEffect(
    () =>
      on('tour:end', () => {
        // Need to set our running state to false, so we can restart if we click start again.
        setState({ complete: true, run: false, stepIndex: 0 });
      }),
    [on, setState],
  );

  const handleClickOpen = () => {
    setState({
      isNotificationsOpen: !isNotificationsOpen,
      stepIndex: stepIndex === 0 ? 1 : stepIndex,
    });
  };

  const handleClickStart = () => {
    setState({
      complete: false,
      run: true,
    });
  };

  const handleChangeSidebar = (isOpen: boolean) => {
    setState({ isNotificationsOpen: isOpen });
  };

  return (
    <div
      className={cn('flex flex-col bg-slate-300 dark:bg-slate-700', {
        'min-h-[calc(100dvh-4rem)] xl:h-[calc(100dvh-4rem)]': withHeader,
        'min-h-dvh xl:h-dvh': !withHeader,
      })}
    >
      <Container className="py-4 overflow-hidden">
        {Tour}
        <Notifications
          isOpen={isNotificationsOpen}
          markAsReadRef={markAsReadRef}
          noticationsRef={noticationsRef}
          onChange={handleChangeSidebar}
          onChangeButton={handleClickOpen}
          triggerRef={triggerRef}
        />
        <div className="flex flex-col flex-1 min-h-0" id="innerContainer">
          <div className="h-26 flex flex-col items-center justify-start gap-2">
            <h1 className="text-4xl font-bold text-center">DASHBOARD</h1>
            {!run && (
              <Button color="primary" data-testid="button-control" onPress={handleClickStart}>
                {complete ? 'Restart Tour' : 'Start Tour'}
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 flex-1 min-h-0">
            <Calendar ref={calendarRef} />
            <Growth ref={growthRef} />
            <Users ref={usersRef} />
            <Connections ref={connectionsRef} />
          </div>
        </div>
      </Container>
    </div>
  );
}
