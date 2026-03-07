'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { type Props, useJoyride } from 'react-joyride';
import { usePrevious, useUpdateEffect } from '@gilbarbara/hooks';
import {
  Button,
  cn,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from '@heroui/react';
import is from 'is-lite';
import { CircleChevronRightIcon, CircleChevronUpIcon, FlaskConicalIcon } from 'lucide-react';

import { useConfig } from '~/context/ConfigContext';
import useTheme from '~/hooks/useTheme';
import { getTourColors, mergeProps } from '~/modules/helpers';

import Collapse from '~/components/Collapse';
import ConfigPanel from '~/components/ConfigPanel/ConfigPanel';

const STORAGE_KEY = 'react-joyride-playground-seen';

interface PlaygroundProps {
  inline?: boolean;
  title?: string;
}

const steps = [
  {
    target: '[data-tour="prop-1"]',
    content: 'Welcome! This card shows how different props affect the tour.',
    title: 'Welcome',
  },
  {
    target: '[data-tour="prop-2"]',
    content: 'Toggle the controls on the left to see changes in real-time.',
    title: 'Controls',
  },
  {
    target: '[data-tour="prop-3"]',
    content: 'Try enabling "continuous" mode and "showProgress" for a guided experience.',
    title: 'Try It Out',
  },
  {
    target: '[data-tour="prop-4"]',
    content: "That's it! Reset and experiment with different combinations.",
    title: 'Done',
  },
];

export default function Playground(props: PlaygroundProps) {
  const { inline = false, title = 'Playground' } = props;
  const { isDarkMode } = useTheme();
  const { joyrideProps, registerConfig } = useConfig();
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  const [run, setRun] = useState(false);
  const [isWrapperOpen, setIsWrapperOpen] = useState(true);
  const [seen, setSeen] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  const previousIsOpen = usePrevious(isOpen);

  const baseProps = useMemo(
    () =>
      ({
        continuous: true,
        options: {
          buttons: ['back', 'close', 'primary', 'skip'],
          scrollOffset: 64,
          showProgress: true,
          skipScroll: true,
          spotlightPadding: 16,
          spotlightRadius: 16,
          ...getTourColors(isDarkMode),
          zIndex: 100,
        },
      }) satisfies Omit<Props, 'steps'>,
    [isDarkMode],
  );

  useEffect(() => {
    registerConfig(baseProps);
  }, [baseProps, registerConfig]);

  const { controls, on, state, Tour } = useJoyride({
    onEvent: data => {
      if (data.type === 'tour:end' || data.type === 'tour:status') {
        if (data.status === 'finished' || data.status === 'skipped') {
          setRun(false);
        }
      }
    },
    steps,
    run,
    ...mergeProps(baseProps, joyrideProps),
  });

  useEffect(() => {
    on('tour:end', () => {
      controls.reset();
      setRun(false);
    });
  }, [controls, on]);

  useUpdateEffect(() => {
    if (!is.boolean(previousIsOpen)) {
      return;
    }

    if (previousIsOpen !== isOpen && !isOpen) {
      controls.reset();
      setRun(false);
    }
  }, [controls, isOpen, previousIsOpen]);

  const handleClickStart = useCallback(() => {
    setRun(true);
  }, []);

  const handleClickReset = useCallback(() => {
    controls.reset(true);
  }, [controls]);

  const handleClickToggle = useCallback(() => {
    setIsWrapperOpen(previous => !previous);
  }, []);

  const content = (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div
            className="p-4 rounded-lg border border-default bg-default-100 text-center"
            data-tour="prop-1"
          >
            <div className="text-lg font-semibold mb-1">Welcome</div>
            <div className="text-xs text-default-500">Step 1</div>
          </div>
          <div
            className="p-4 rounded-lg border border-default bg-default-100 text-center"
            data-tour="prop-2"
          >
            <div className="text-lg font-semibold mb-1">Controls</div>
            <div className="text-xs text-default-500">Step 2</div>
          </div>
          <div
            className="p-4 rounded-lg border border-default bg-default-100 text-center"
            data-tour="prop-3"
          >
            <div className="text-lg font-semibold mb-1">Try It Out</div>
            <div className="text-xs text-default-500">Step 3</div>
          </div>
          <div
            className="p-4 rounded-lg border border-default bg-default-100 text-center"
            data-tour="prop-4"
          >
            <div className="text-lg font-semibold mb-1">Done</div>
            <div className="text-xs text-default-500">Step 4</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          {run && state.index > 0 && (
            <Button onPress={handleClickReset} variant="bordered">
              Reset
            </Button>
          )}
          {!run && (
            <Button color="primary" onPress={handleClickStart}>
              Start Tour
            </Button>
          )}
        </div>

        {Tour}
      </div>
      <div
        className={cn(
          'w-full md:w-72 border-b md:border-b-0 md:border-l border-default bg-default-50',
          {
            'h-96': !inline,
            'h-128': inline,
          },
        )}
      >
        <ConfigPanel onClose={onClose} />
      </div>
    </div>
  );

  if (!inline) {
    return (
      <>
        <Tooltip
          classNames={{
            base: 'before:right-5!',
          }}
          content="Open Playground"
          {...(!seen ? { isOpen: true } : {})}
          placement="bottom-end"
          showArrow
        >
          <Button
            className="fixed top-20 right-4 rounded-full print:hidden"
            color="primary"
            isIconOnly
            onPress={() => {
              if (!seen) {
                setSeen(true);
                localStorage.setItem(STORAGE_KEY, 'true');
              }

              onOpen();
            }}
            size="lg"
          >
            <FlaskConicalIcon />
          </Button>
        </Tooltip>
        {isOpen && (
          <Modal
            backdrop="blur"
            classNames={{
              backdrop: '!z-[80]',
              wrapper: '!z-[90]',
            }}
            isDismissable={false}
            isKeyboardDismissDisabled
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="3xl"
          >
            <ModalContent>
              <ModalHeader className="justify-center px-4 py-2">{title}</ModalHeader>
              <Divider />
              <ModalBody className="p-0">{content}</ModalBody>
            </ModalContent>
          </Modal>
        )}
      </>
    );
  }

  return (
    <div className="my-6 rounded-lg border border-default overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 bg-default-100 border-b border-default">
        <span className="font-bold">{title}</span>
        <button className="ml-auto" onClick={handleClickToggle} type="button">
          {isWrapperOpen ? <CircleChevronUpIcon size={20} /> : <CircleChevronRightIcon size={18} />}
        </button>
      </div>
      <Collapse isOpen={isWrapperOpen}>{content}</Collapse>
    </div>
  );
}
