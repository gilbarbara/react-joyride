'use client';

import { useEffect, useMemo } from 'react';
import { type EventData, Joyride, type Props, STATUS, type Step } from 'react-joyride';
import { usePrevious, useSetState } from '@gilbarbara/hooks';
import { Link } from '@heroui/react';

import { useConfig } from '~/context/ConfigContext';
import useTheme from '~/hooks/useTheme';
import { delay, getTourColors, logGroup, mergeProps } from '~/modules/helpers';

import Code from '~/components/Code';
import Container from '~/components/Container';
import Tip from '~/components/Tip';

import HeroModal from './HeroModal';
import ReactModal from './ReactModal';

interface State {
  activeModal: 'none' | 'react-modal' | 'heroui';
  activeSection: 'profile' | 'notifications';
  run: boolean;
}

export default function Modal() {
  const { joyrideProps, registerConfig } = useConfig();
  const [{ activeModal, activeSection, run }, setState] = useSetState<State>({
    activeModal: 'none',
    activeSection: 'profile',
    run: false,
  });
  const previousActiveModal = usePrevious(activeModal);
  const { isDarkMode } = useTheme();

  const reactModalSteps: Step[] = useMemo(
    () => [
      {
        before: () => delay(100),
        content: (
          <>
            <p>Search and filter the table data.</p>
            <Tip iconSize={24}>
              This step has <Code color="primary">disableFocusTrap</Code> enabled to allow keyboard
              interaction with the input field.
            </Tip>
          </>
        ),
        disableFocusTrap: true,
        locale: {
          open: 'Start the tour',
        },
        placement: 'bottom',
        target: '.rm-toolbar',
        title: 'Toolbar',
      },
      {
        content: (
          <>
            <p>Column headers describe each data field.</p>
            <Tip iconSize={24}>
              This step has <Code color="primary">blockTargetInteraction</Code> enabled to prevent
              interactions with the target.
            </Tip>
          </>
        ),
        placement: 'bottom',
        target: '.rm-table',
        title: 'Data table',
        blockTargetInteraction: true,
      },
      {
        content: 'Toggle switches are highlighted without interfering with the modal backdrop.',
        placement: 'bottom',
        target: '.rm-toggles',
        title: 'Table options',
      },
      {
        content: 'The tour handles modal z-index stacking correctly — no workarounds needed.',
        placement: 'top',
        target: '.rm-actions',
        title: 'Actions',
      },
    ],
    [],
  );

  const heroSteps: Step[] = useMemo(
    () => [
      {
        before: () => delay(300),
        content: (
          <>
            <p>Navigate between settings sections using the sidebar.</p>
            <Tip iconSize={24}>
              This step <Code color="primary">before</Code> hook adds a 300ms delay to wait for the
              modal to open.
            </Tip>
          </>
        ),
        placement: 'right',
        target: '.settings-sidebar',
        title: 'Settings navigation',
        locale: {
          open: 'Start the tour',
        },
      },
      {
        content: (
          <>
            <p>Update your public display name.</p>
            <Tip iconSize={24}>
              This step has <Code color="primary">disableFocusTrap</Code> enabled to allow keyboard
              interaction with the input field.
            </Tip>
          </>
        ),
        placement: 'bottom',
        target: '.settings-display-name',
        title: 'Display Name',
        disableFocusTrap: true,
      },
      {
        content: 'Choose your preferred language for the interface.',
        placement: 'bottom',
        target: '.settings-language',
        title: 'Language',
      },
      {
        before: ({ action }) => {
          if (action === 'prev') {
            setState({ activeSection: 'profile' });

            return delay(200);
          }

          return Promise.resolve();
        },
        content: 'Toggle this to hide your profile from public searches.',
        placement: 'left',
        target: '.settings-private-profile',
        title: 'Private Profile',
      },
      {
        before: ({ action }) => {
          if (action === 'next') {
            setState({ activeSection: 'notifications' });

            return delay(200);
          }

          return Promise.resolve();
        },
        content: (
          <>
            <p>Let's switch to the notifications</p>
            <Tip iconSize={24}>
              This step <Code color="primary">before</Code> hook switched the active section to
              notifications.
            </Tip>
          </>
        ),
        placement: 'right',
        target: '.settings-sidebar button:nth-child(2)',
        title: 'Notifications',
      },
      {
        loaderDelay: 0,
        content: 'Control which notifications reach your mobile device.',
        placement: 'bottom',
        target: '.settings-mobile-push',
        title: 'Mobile Push',
      },
      {
        content: 'Manage your email and communication preferences.',
        placement: 'bottom',
        target: '.settings-email',
        title: 'Email & Communication',
      },
      {
        content: 'Choose whether to receive marketing and social updates.',
        placement: 'bottom',
        target: '.settings-marketing',
        title: 'Marketing & Social',
      },
    ],
    [setState],
  );

  const steps = useMemo(() => {
    if (activeModal !== 'none') {
      return activeModal === 'heroui' ? heroSteps : reactModalSteps;
    }

    return [];
  }, [activeModal, heroSteps, reactModalSteps]);

  const baseProps = useMemo(
    () =>
      ({
        continuous: true,
        options: {
          buttons: ['back', 'close', 'primary', 'skip'],
          ...getTourColors(isDarkMode),
        },
      }) satisfies Omit<Props, 'steps'>,
    [isDarkMode],
  );

  useEffect(() => {
    registerConfig(baseProps);
  }, [baseProps, registerConfig]);

  useEffect(() => {
    if (previousActiveModal === 'none' && activeModal !== 'none') {
      setState({ run: true });
    }
  });

  const handleEvent = (data: EventData) => {
    const { status, type } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setState({ run: false });
    }

    logGroup(type, data);
  };

  const handleClickOpenHeroModal = () => {
    setState({ activeModal: 'heroui', activeSection: 'profile' });
  };

  const handleClickOpenReactModal = () => {
    setState({ activeModal: 'react-modal' });
  };

  const handleClickCloseReactModal = () => {
    setState({ activeModal: 'none', run: false });
  };

  const handleOpenChangeHeroModal = (isOpen: boolean) => {
    if (!isOpen) {
      setState({ activeModal: 'none', run: false });
    }
  };

  const handleOpenReactModal = () => {
    setState({ run: true });
  };

  const handleSectionChange = (section: 'profile' | 'notifications') => {
    if (section === activeSection) return;

    setState({ activeSection: section });
  };

  return (
    <div className="bg-emerald-50 dark:bg-emerald-950 flex flex-col flex-1">
      <Container className="py-8 items-center justify-center">
        <Joyride
          onEvent={handleEvent}
          run={run}
          steps={steps}
          {...mergeProps(baseProps, joyrideProps)}
        />
        <h1 className="text-4xl font-bold mb-2">It works with modals</h1>
        <h2 className="text-2xl font-bold mb-8">
          Using{' '}
          <Link
            className="text-2xl underline"
            href="https://github.com/reactjs/react-modal"
            isExternal
            size="lg"
          >
            react-modal
          </Link>
          {' and '}
          <Link
            className="text-2xl underline"
            href="https://www.heroui.com/docs/components/modal"
            isExternal
          >
            HeroUI Modal
          </Link>
        </h2>
        <div className="flex gap-4">
          <ReactModal
            activeModal={activeModal}
            isDarkMode={isDarkMode}
            onAfterOpen={handleOpenReactModal}
            onClose={handleClickCloseReactModal}
            onOpen={handleClickOpenReactModal}
            onRequestClose={handleClickCloseReactModal}
          />
          <HeroModal
            activeModal={activeModal}
            activeSection={activeSection}
            onOpen={handleClickOpenHeroModal}
            onOpenChange={handleOpenChangeHeroModal}
            onSectionChange={handleSectionChange}
          />
        </div>

        {/* React Modal — data table with toolbar */}
      </Container>
    </div>
  );
}
