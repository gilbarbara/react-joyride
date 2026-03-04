import { type ChangeEvent, forwardRef, Fragment, type ReactNode, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  type BeaconRenderProps,
  STATUS,
  type Step,
  type TooltipRenderProps,
  useJoyride,
} from 'react-joyride';
import { useMount, useSetState } from '@gilbarbara/hooks';
import { Button, Input, Select, SelectItem } from '@heroui/react';
// @ts-ignore
import a11yChecker from 'a11y-checker';
import { Globe } from 'lucide-react';

import { messages } from '~/CustomComponents/messages';

import Container from '~/components/Container';

import { logGroup } from '../modules/helpers';

import Grid from './Grid';
import Intl from './Intl';

interface IntlProps {
  children: ReactNode;
  locale: string;
}

interface Props {
  locale: string;
  setLocale: (locale: string) => void;
}

interface State {
  complete: boolean;
  run: boolean;
  steps: Step[];
}

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Français', value: 'fr' },
  { label: 'Português', value: 'pt' },
];

const BeaconComponent = forwardRef<HTMLButtonElement, BeaconRenderProps>((props, ref) => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { continuous, index, isLastStep, size, step, ...rest } = props;

  return (
    <button
      ref={ref}
      className="relative h-12 w-12"
      data-test-id="button-beacon"
      type="button"
      {...rest}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[rgba(48,48,232,0.6)]" />
      <span className="absolute inset-0 rounded-full bg-[rgba(48,48,232,0.6)]" />
    </button>
  );
});

function Custom(props: Props) {
  const { locale, setLocale } = props;
  const [{ complete, run, steps }, setState] = useSetState<State>({
    complete: false,
    run: true,
    steps: [
      {
        content: (
          <Fragment>
            <h5 style={{ marginTop: 0 }}>Weekly magic on your inbox</h5>
            <div className="flex gap-2">
              <Input name="email" placeholder="Type your email" type="email" />
              <Button>SEND</Button>
            </div>
          </Fragment>
        ),
        placementBeacon: 'top' as const,
        target: '.image-grid div:nth-child(1)',
        title: 'Our awesome projects',
      },
      {
        content: 'Change the world, obviously',
        disableCloseOnEsc: true,
        disableOverlay: true,
        target: '.image-grid div:nth-child(2)',
        title: 'Our Mission',
      },
      {
        content: 'Special stuff just for you!',
        placement: 'top' as const,
        styles: {
          options: {
            arrowColor: '#dbeafe',
          },
        },
        target: '.image-grid div:nth-child(4)',
        title: 'The good stuff',
      },
      {
        content: (
          <div>
            <svg
              height="96px"
              preserveAspectRatio="xMidYMid"
              role="img"
              viewBox="0 0 96 96"
              width="96px"
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
        placement: 'right' as const,
        target: '.image-grid div:nth-child(5)',
        title: 'We are the people',
      },
    ],
  });

  const { controls, Tour } = useJoyride({
    beaconComponent: BeaconComponent,
    onEvent: data => {
      const { status, type } = data;
      const options: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

      if (options.includes(status)) {
        setState({ complete: true, run: false });
      }

      logGroup(type, data);
    },
    locale: messages,
    run,
    stepOptions: {
      showSkipButton: true,
    },
    steps,
    styles: {
      options: {
        zIndex: 2000000,
      },
      overlay: {
        backgroundColor: 'rgba(79, 46, 8, 0.5)',
      },
    },
    tooltipComponent: Tooltip,
  });

  useMount(() => {
    a11yChecker();
  });

  const handleClickRestart = () => {
    setState({ complete: false });
    controls.reset(true);
  };

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setLocale(event.target.value);
  };

  return (
    <Container className="bg-danger-50 py-8">
      <FormattedMessage id="title">
        {value => <h1 className="text-4xl font-bold text-center">{value}</h1>}
      </FormattedMessage>
      <div className="flex justify-center gap-4 my-4">
        <Select
          aria-label="Language"
          className="max-w-48"
          defaultSelectedKeys={[locale]}
          onChange={handleSelect}
          size="sm"
          startContent={<Globe size={16} />}
        >
          {languageOptions.map(opt => (
            <SelectItem key={opt.value}>{opt.label}</SelectItem>
          ))}
        </Select>
        {complete && (
          <Button color="primary" onPress={handleClickRestart} size="sm">
            <FormattedMessage id="restart" />
          </Button>
        )}
      </div>
      {Tour}
      <Grid />
    </Container>
  );
}

function IntlWrapper({ children, locale }: IntlProps) {
  return <Intl locale={locale}>{children}</Intl>;
}

function Tooltip(props: TooltipRenderProps) {
  const { backProps, continuous, index, isLastStep, primaryProps, skipProps, step, tooltipProps } =
    props;

  return (
    <div
      {...tooltipProps}
      className="bg-white w-xs overflow-hidden rounded-md"
      data-test-id="tooltip"
    >
      <div className="p-4">
        {step.title && <h3 className="text-xl font-bold text-primary mb-4">{step.title}</h3>}
        {step.content && <div>{step.content}</div>}
      </div>
      <div className="bg-blue-100 p-2">
        <div className="flex justify-between">
          {!isLastStep && (
            <button
              {...skipProps}
              className="px-3 py-1 text-sm rounded hover:bg-blue-200"
              type="button"
            >
              <FormattedMessage id="skip" />
            </button>
          )}
          <div className="flex gap-2">
            {index > 0 && (
              <button
                {...backProps}
                className="px-3 py-1 text-sm rounded hover:bg-blue-200"
                type="button"
              >
                <FormattedMessage id="back" />
              </button>
            )}
            <button
              {...primaryProps}
              className="px-3 py-1 text-sm rounded bg-primary text-white hover:opacity-90"
              type="button"
            >
              <FormattedMessage id={continuous ? 'next' : 'close'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomIntl() {
  const [locale, setLocale] = useState('en');

  return (
    <IntlWrapper locale={locale}>
      <Custom locale={locale} setLocale={setLocale} />
    </IntlWrapper>
  );
}
