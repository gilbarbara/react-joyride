'use client';

import { Fragment, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { type Props, STATUS, type Step, useJoyride } from 'react-joyride';
import { useSetState } from '@gilbarbara/hooks';
import { Button, Chip, cn } from '@heroui/react';
import { useSearchParams } from 'next/navigation';

import { useConfig } from '~/context/ConfigContext';
import useTheme from '~/hooks/useTheme';
import { getTourColors, logGroup, mergeProps } from '~/modules/helpers';

import Code from '~/components/Code';
import Container from '~/components/Container';
import CustomArrow from '~/components/CustomArrow';
import CustomBeacon from '~/components/CustomBeacon';
import CustomTooltip from '~/components/CustomTooltip';
import Tip from '~/components/Tip';

import Grid from './Grid';

interface State {
  complete: boolean;
  continuous: boolean;
  run: boolean;
  steps: Step[];
}

export default function CustomComponents() {
  const params = useSearchParams();
  const isE2E = params?.has('e2e') ?? false;
  const { joyrideProps, registerConfig } = useConfig();
  const { isDarkMode } = useTheme();
  const [{ complete, continuous, run, steps }, setState] = useSetState<State>({
    continuous: false,
    complete: false,
    run: false,
    steps: [],
  });

  const baseProps = useMemo(
    () =>
      ({
        arrowComponent: CustomArrow,
        beaconComponent: CustomBeacon,
        tooltipComponent: CustomTooltip,
        continuous,
        options: {
          buttons: ['back', 'close', 'primary', 'skip'],
          ...getTourColors(isDarkMode),
          arrowColor: isDarkMode ? '#000000' : '#ffffff',
          overlayColor: 'rgba(79, 46, 8, 0.5)',
        },
      }) satisfies Omit<Props, 'steps'>,
    [continuous, isDarkMode],
  );

  useEffect(() => {
    setState({
      run: true,
      steps: [
        {
          content: (
            <Fragment>
              <p>Instead of the default pulsing circle.</p>
              <Tip iconSize={24}>
                The <Code color="primary">beaconTrigger</Code> is set to hover, so the tooltip opens
                without clicking.
              </Tip>
            </Fragment>
          ),
          beaconPlacement: 'top',
          beaconTrigger: 'hover',
          target: '.image-grid div:nth-child(1)',
          title: 'Custom Beacon',
        },
        {
          content: (
            <Fragment>
              <p>You can setup dot indicators, progress bar, and more.</p>
              <p className="mt-2">
                <Button
                  color="primary"
                  data-testid="continuous-toggle"
                  onPress={() =>
                    setState(previousState => ({
                      ...previousState,
                      continuous: !previousState.continuous,
                    }))
                  }
                  size="sm"
                >
                  {continuous ? 'Disable' : 'Enable'} "continuous" mode
                </Button>
              </p>
            </Fragment>
          ),
          target: '.image-grid div:nth-child(2)',
          title: 'Custom Tooltip',
        },
        {
          content: (
            <Fragment>
              <p>ESC is disabled on this step — try it.</p>
              <Tip>
                With <Code color="primary">dismissKeyAction: false</Code>.
              </Tip>
            </Fragment>
          ),
          dismissKeyAction: false,
          placement: 'top',
          target: '.image-grid div:nth-child(4)',
          title: 'The good stuff',
        },
        {
          content: (
            <Fragment>
              <p>The buttons and state chips above are powered by useJoyride hook.</p>
              <Tip>
                <Code color="primary">useJoyride</Code> returns <b>controls</b>, <b>state</b>, and{' '}
                <b>Tour</b>.
              </Tip>
            </Fragment>
          ),
          placement: 'right',
          target: '.image-grid div:nth-child(5)',
          title: 'Programmatic Control',
        },
      ],
    });
  }, [continuous, setState]);

  useEffect(() => {
    registerConfig(baseProps);
  }, [baseProps, registerConfig]);

  const { controls, state, Tour } = useJoyride({
    onEvent: data => {
      const { status, type } = data;
      const options: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

      if (options.includes(status)) {
        setState({ complete: true, run: false });
      }

      logGroup(type, data);
    },
    run,
    steps,
    ...mergeProps(baseProps, joyrideProps),
  });

  const handleClickRestart = () => {
    setState({ complete: false });
    controls.reset(true);
  };

  return (
    <div className="bg-indigo-50 dark:bg-indigo-950 flex-1">
      <Container
        className={cn({
          'py-8': !isE2E,
          'py-4': isE2E,
        })}
      >
        <h1
          className={cn('text-4xl font-bold text-center', {
            'mb-2': !isE2E,
            'mb-8': isE2E,
          })}
        >
          Custom Components & Controls
        </h1>
        {!isE2E && (
          <p className="text-center text-default-600 max-w-xl mx-auto mb-8">
            Built with the <Code color="primary">useJoyride</Code> hook, custom arrow, beacon and
            tooltip components, and programmatic controls.
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center w-full max-w-xl  mx-auto bg-black/20 rounded-large p-4 gap-4 mb-6">
          <Chip>status: {state.status}</Chip>
          <Chip>index: {state.index}</Chip>
          <Chip>lifecycle: {state.lifecycle}</Chip>
          <Chip>action: {state.action}</Chip>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {/* Controls */}
          {complete ? (
            <Button color="primary" onPress={handleClickRestart}>
              <FormattedMessage id="restart" />
            </Button>
          ) : (
            <>
              <Button
                color="primary"
                isDisabled={state.status === 'running'}
                onPress={() => controls.start()}
                variant="flat"
              >
                <FormattedMessage id="start" />
              </Button>
              <Button
                color="warning"
                isDisabled={state.status !== 'running'}
                onPress={() => controls.stop()}
                variant="flat"
              >
                <FormattedMessage id="stop" />
              </Button>
              <Button color="primary" onPress={() => controls.reset()} variant="flat">
                <FormattedMessage id="reset" />
              </Button>
              <Button
                color="default"
                isDisabled={state.status !== 'running' || state.lifecycle !== 'beacon'}
                onPress={() => controls.open()}
                variant="flat"
              >
                <FormattedMessage id="openTooltip" />
              </Button>
              <Button
                color="default"
                isDisabled={state.status !== 'running' || state.index <= 0}
                onPress={() => controls.prev()}
                variant="flat"
              >
                <FormattedMessage id="prev" />
              </Button>
              <Button
                color="default"
                isDisabled={state.status !== 'running'}
                onPress={() => controls.next()}
                variant="flat"
              >
                <FormattedMessage id="next" />
              </Button>
              <Button
                color="danger"
                isDisabled={state.status !== 'running'}
                onPress={() => controls.skip()}
                variant="flat"
              >
                <FormattedMessage id="skip" />
              </Button>
            </>
          )}
        </div>

        {Tour}
        <Grid />
      </Container>
    </div>
  );
}
