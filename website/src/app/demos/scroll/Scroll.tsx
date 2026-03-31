'use client';

import { useEffect, useMemo } from 'react';
import { type EventData, Joyride, type Props, STATUS, type Step } from 'react-joyride';
import { useSetState } from '@gilbarbara/hooks';
import { Button } from '@heroui/react';

import { useConfig } from '~/context/ConfigContext';
import useTheme from '~/hooks/useTheme';
import { getTourColors, logGroup, mergeProps } from '~/modules/helpers';

import Code from '~/components/Code';
import Container from '~/components/Container';
import Tip from '~/components/Tip';

interface State {
  run: boolean;
  steps: Step[];
}

const steps: Step[] = [
  {
    content: (
      <div>
        <p>This tour scrolls inside a custom container automatically.</p>
        <Tip>
          This demo uses <Code color="primary">styles.spotlight</Code> to add a subtle border around
          the spotlight.
        </Tip>
      </div>
    ),
    target: '.ds__header',
    title: 'Custom Scroll Parent',
  },
  {
    content:
      'A consistent type scale creates visual hierarchy and guides the reader through content.',
    placement: 'top',
    target: '.ds__typography',
    title: 'Typography',
  },
  {
    content: 'A purposeful palette keeps your UI cohesive. Each swatch maps to a semantic role.',
    placement: 'bottom',
    target: '.ds__colors',
    title: 'Color Palette',
  },
  {
    content:
      'Spacing tokens ensure consistent rhythm across your UI. These scale from 4px to 64px.',
    placement: 'top',
    target: '.ds__spacing',
    title: 'Spacing Scale',
  },
  {
    content: 'Button variants communicate different levels of emphasis and intent.',
    placement: 'top',
    target: '.ds__buttons',
    title: 'Button Variants',
  },
];

const colors = [
  { name: 'Primary', value: '#ff0044', text: 'white' },
  { name: 'Secondary', value: '#6366f1', text: 'white' },
  { name: 'Success', value: '#22c55e', text: 'white' },
  { name: 'Warning', value: '#f59e0b', text: 'black' },
  { name: 'Danger', value: '#ef4444', text: 'white' },
  { name: 'Info', value: '#3b82f6', text: 'white' },
  { name: 'Neutral', value: '#71717a', text: 'white' },
  { name: 'Surface', value: '#f4f4f5', text: 'black' },
];

const spacingSteps = [4, 8, 12, 16, 24, 32, 48, 64];

export default function Scroll() {
  const { joyrideProps, registerConfig } = useConfig();
  const { isDarkMode } = useTheme();
  const [{ run }, setState] = useSetState<State>({
    run: true,
    steps,
  });

  const baseProps = useMemo(
    () =>
      ({
        continuous: true,
        scrollToFirstStep: true,
        options: {
          ...getTourColors(isDarkMode),
          spotlightPadding: 16,
          spotlightRadius: 16,
        },
        styles: {
          spotlight: {
            stroke: isDarkMode ? '#ff5e5e99' : '#ff5e5e',
            strokeWidth: '2px',
          },
        },
      }) satisfies Omit<Props, 'steps'>,
    [isDarkMode],
  );

  useEffect(() => {
    registerConfig(baseProps);
  }, [baseProps, registerConfig]);

  const handleEvent = (data: EventData) => {
    const { status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as typeof STATUS.FINISHED)) {
      setState({ run: false });
    }

    logGroup(type, data);
  };

  const handleRestart = () => {
    const scroller = document.querySelector('.app__scroller');

    if (scroller) {
      scroller.scrollTop = 0;
    }

    setState({ run: false });

    requestAnimationFrame(() => {
      setState({ run: true });
    });
  };

  return (
    <div className="bg-default-200 dark:bg-default-50 flex flex-col flex-1">
      <Container className="items-center justify-center py-8">
        <Joyride
          onEvent={handleEvent}
          run={run}
          steps={steps}
          {...mergeProps(baseProps, joyrideProps)}
        />
        <div className="flex items-center justify-center w-full gap-2 mb-8">
          <h1 className="text-4xl font-bold text-red">Works with custom scrolling parents!</h1>
          {!run && (
            <Button
              className="mt-2"
              color="primary"
              onPress={handleRestart}
              size="sm"
              variant="bordered"
            >
              Restart Tour
            </Button>
          )}
        </div>
        <div className="app__scroller bg-white dark:bg-default-100 h-[60vh] p-6 overflow-y-auto rounded-lg w-full">
          {/* Header */}
          <div className="ds__header mb-8">
            <h2 className="text-2xl font-bold mb-2">Design System</h2>
            <p className="text-default-500">
              A collection of reusable tokens and components that define the visual language of your
              application.
            </p>
          </div>

          {/* Typography */}
          <section className="ds__typography mb-8">
            <h3 className="text-xl font-bold mb-4 text-default-700">Typography</h3>
            <div className="space-y-3">
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-default-400 w-16 shrink-0">Display</span>
                <span className="text-4xl font-bold">Aa Bb Cc</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-default-400 w-16 shrink-0">Heading</span>
                <span className="text-2xl font-semibold">Aa Bb Cc</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-default-400 w-16 shrink-0">Body</span>
                <span className="text-base">Aa Bb Cc</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-default-400 w-16 shrink-0">Caption</span>
                <span className="text-sm text-default-500">Aa Bb Cc</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-xs text-default-400 w-16 shrink-0">Mono</span>
                <span className="text-sm font-mono">console.log()</span>
              </div>
            </div>
          </section>

          {/* Colors */}
          <section className="ds__colors mb-8">
            <h3 className="text-xl font-bold mb-4 text-default-700">Color Palette</h3>
            <div className="grid grid-cols-4 gap-3">
              {colors.map(color => (
                <div key={color.name} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full h-12 rounded-lg shadow-sm"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs font-medium">{color.name}</span>
                  <span className="text-[10px] text-default-400 font-mono">{color.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Spacing */}
          <section className="ds__spacing mb-8">
            <h3 className="text-xl font-bold mb-4 text-default-700">Spacing Scale</h3>
            <div className="space-y-2">
              {spacingSteps.map(size => (
                <div key={size} className="flex items-center gap-3">
                  <span className="text-xs text-default-400 w-10 text-right font-mono shrink-0">
                    {size}px
                  </span>
                  <div
                    className="h-4 bg-primary/60 rounded-sm"
                    style={{ width: `${size * 3}px` }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Buttons */}
          <section className="ds__buttons mb-8">
            <h3 className="text-xl font-bold mb-4 text-default-700">Button Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button color="primary" size="sm">
                Primary
              </Button>
              <Button color="secondary" size="sm">
                Secondary
              </Button>
              <Button color="success" size="sm">
                Success
              </Button>
              <Button color="warning" size="sm">
                Warning
              </Button>
              <Button color="danger" size="sm">
                Danger
              </Button>
              <Button color="primary" size="sm" variant="bordered">
                Bordered
              </Button>
              <Button color="primary" size="sm" variant="ghost">
                Ghost
              </Button>
              <Button color="primary" size="sm" variant="light">
                Light
              </Button>
            </div>
          </section>

          {/* Shadows */}
          <section className="ds__shadows">
            <h3 className="text-xl font-bold mb-4 text-default-700">Elevation</h3>
            <div className="flex gap-4">
              {['shadow-sm', 'shadow', 'shadow-md', 'shadow-lg'].map(shadow => (
                <div
                  key={shadow}
                  className={`w-20 h-20 rounded-lg bg-white dark:bg-default-200 flex items-center justify-center ${shadow}`}
                >
                  <span className="text-[10px] text-default-400 font-mono">
                    {shadow.replace('shadow-', '').replace('shadow', 'base')}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
