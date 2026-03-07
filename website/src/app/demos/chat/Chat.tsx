'use client';

import { useEffect, useMemo, useState } from 'react';
import { type EventData, Joyride, type Props, STATUS, type Step } from 'react-joyride';
import { Button, cn } from '@heroui/react';
import { useSearchParams } from 'next/navigation';

import { useConfig } from '~/context/ConfigContext';
import useTheme from '~/hooks/useTheme';
import { getTourColors, logGroup, mergeProps } from '~/modules/helpers';

import Code from '~/components/Code';
import Tip from '~/components/Tip';

import ChatApp from './ChatApp';

const tourSteps: Step[] = [
  {
    content: (
      <>
        <p>Your workspace hub. Switch between teams and projects from here.</p>
        <Tip iconSize={24}>
          This step uses <Code color="primary">spotlightRadius</Code> to match the element radius.
        </Tip>
      </>
    ),
    floatingOptions: {
      beaconOptions: {
        offset: -10,
      },
    },
    placement: 'right',
    spotlightPadding: 4,
    spotlightRadius: 12,
    target: '.chat__workspace',
    title: 'Your Workspace',
  },
  {
    content: <p>Find messages, channels, and people across your workspace.</p>,
    placement: 'bottom',
    target: '.chat__search',
    title: 'Search',
  },
  {
    content: (
      <>
        <p>
          Browse and join channels to collaborate with your team. Channels organize conversations by
          topic or project.
        </p>
        <Tip iconSize={24}>
          This step uses <Code color="primary">placement: right</Code> to use the available space
        </Tip>
      </>
    ),
    placement: 'right',
    spotlightPadding: { top: 30, bottom: 4, left: 4, right: 4 },
    target: '.channel-list',
    title: 'Channels',
  },
  {
    content: 'Send private messages to individuals or small groups.',
    placement: 'right',
    spotlightPadding: 2,
    target: '.chat__dms',
    title: 'Direct Messages',
  },
  {
    content: <p>See channel details, member count, and settings at a glance.</p>,
    placement: 'bottom',
    target: '.chat__header',
    title: 'Channel Info',
  },
  {
    content: (
      <>
        <p>React to messages with emoji to give quick feedback without typing a reply.</p>
        <Tip iconSize={24}>Steps can target elements inside scrollable containers.</Tip>
      </>
    ),
    placement: 'top',
    target: '.chat__reactions',
    title: 'Reactions',
  },
  {
    blockTargetInteraction: true,
    content: (
      <>
        <p>
          Write and format messages with the rich text toolbar, attach files, and mention teammates.
        </p>
        <Tip iconSize={24}>
          <Code color="primary">blockTargetInteraction</Code> prevents clicking the target during
          the step.
        </Tip>
      </>
    ),
    placement: 'top',
    target: '.chat__composer',
    title: 'Message Composer',
  },
  {
    content: <p>Start a new channel, group conversation, or direct message.</p>,
    placement: 'right',
    spotlightPadding: 6,
    spotlightRadius: 28,
    target: '.chat__create',
    title: 'Create New',
  },
  {
    content: 'Manage your status, preferences, and availability from your profile.',
    placement: 'right',
    spotlightPadding: 6,
    spotlightRadius: 28,
    target: '.chat__profile',
    title: 'Your Profile',
  },
];

export default function Chat() {
  const params = useSearchParams();
  const withHeader = !params?.has('e2e');
  const { joyrideProps, registerConfig } = useConfig();
  const [run, setRun] = useState(true);
  const { isDarkMode } = useTheme();

  const baseProps = useMemo(
    () =>
      ({
        continuous: true,
        options: {
          buttons: ['back', 'close', 'primary', 'skip'],
          scrollOffset: 0,
          showProgress: true,
          ...getTourColors(isDarkMode),
        },
      }) satisfies Omit<Props, 'steps'>,
    [isDarkMode],
  );

  useEffect(() => {
    registerConfig(baseProps);
  }, [baseProps, registerConfig]);

  const handleEvent = (data: EventData) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
    }

    logGroup(type, data);
  };

  const handleClickStart = () => {
    setRun(true);
  };

  return (
    <div
      className={cn('bg-violet-50 dark:bg-violet-950 flex flex-col flex-1 px-8 pb-8', {
        'min-h-[calc(100dvh-4rem)] xl:h-[calc(100dvh-4rem)]': withHeader,
        'min-h-dvh xl:h-dvh': !withHeader,
      })}
    >
      <Joyride
        onEvent={handleEvent}
        run={run}
        steps={tourSteps}
        {...mergeProps(baseProps, joyrideProps)}
      />
      <header className="py-8">
        <h1 className="flex items-center justify-center gap-2 text-4xl font-bold mb-2">
          <span>Chat App</span>
          {!run && (
            <Button color="primary" onPress={handleClickStart} size="sm">
              Restart Tour
            </Button>
          )}
        </h1>
        <p className="text-lg text-default-500 text-center">
          A guided tour of a team communication workspace
        </p>
      </header>
      <ChatApp />
    </div>
  );
}
