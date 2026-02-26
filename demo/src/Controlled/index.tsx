import { useRef } from 'react';
import Joyride, {
  ACTIONS,
  type CallBackProps,
  EVENTS,
  type Events,
  STATUS,
  type Step,
} from 'react-joyride';
import { useMount, useSetState } from '@gilbarbara/hooks';
import { Button } from '@heroui/react';
// @ts-ignore
import a11yChecker from 'a11y-checker';
import { Menu as MenuIcon } from 'lucide-react';

import Sidebar from '~/Controlled/Sidebar';

import { logGroup } from '../modules/helpers';

import Calendar from './Calendar';
import Connections from './Connections';
import Growth from './Growth';
import Users from './Users';

interface State {
  run: boolean;
  sidebarOpen: boolean;
  stepIndex: number;
  steps: Step[];
}

interface StateChange {
  isOpen: boolean;
}

export default function ControlledDemo() {
  const [{ run, sidebarOpen, stepIndex, steps }, setState] = useSetState<State>({
    run: false,
    sidebarOpen: false,
    stepIndex: 0,
    steps: [],
  });

  const calendarRef = useRef<HTMLDivElement>(null);
  const connectionsRef = useRef<HTMLDivElement>(null);
  const disclaimerRef = useRef<HTMLDivElement>(null);
  const growthRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const usersRef = useRef<HTMLDivElement>(null);

  useMount(() => {
    setState({
      run: true,
      steps: [
        {
          content: (
            <div>
              You can interact with your own components through the spotlight.
              <br />
              Click the menu above!
            </div>
          ),
          disableBeacon: true,
          disableOverlayClose: true,
          hideCloseButton: true,
          hideFooter: true,
          placement: 'bottom',
          spotlightClicks: true,
          styles: {
            options: {
              zIndex: 10000,
            },
          },
          target: menuRef,
          title: 'Menu',
        },
        {
          content: 'This is our sidebar, you can find everything you need here',
          disableBeacon: true,
          placement: 'right',
          spotlightPadding: 0,
          stepDelay: 500,
          styles: {
            options: {
              zIndex: 10000,
            },
          },
          target: sidebarRef,
          title: 'Sidebar',
        },
        {
          content: 'The disclaimer of the terms of service',
          disableBeacon: true,
          placement: 'right',
          spotlightPadding: 0,
          styles: {
            options: {
              zIndex: 10000,
            },
          },
          target: disclaimerRef,
          title: 'Disclaimer',
        },
        {
          content: 'Check the availability of the team!',
          disableBeacon: true,
          placement: 'bottom',
          stepDelay: 500,
          styles: {
            options: {
              zIndex: 10000,
            },
          },
          target: calendarRef,
          title: 'The schedule',
        },
        {
          content: <div>Our rate is off the charts!</div>,
          placement: 'bottom',
          spotlightClicks: true,
          target: growthRef,
          title: 'Our Growth',
        },
        {
          content: 'A fake step using a function for target',
          placement: 'bottom',
          target: () => document.querySelector('#inexistent'),
          title: 'Fake Step',
          targetWaitTimeout: 1500,
        },
        {
          content: (
            <div>
              <svg
                aria-hidden="true"
                height="96px"
                preserveAspectRatio="xMidYMid"
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
          placement: 'right',
          target: usersRef,
          title: 'Our Users',
        },
        {
          content: 'The awesome connections you have made',
          placement: 'top',
          target: connectionsRef,
        },
      ],
    });

    a11yChecker();
  });

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setState({ run: false, stepIndex: 0 });
    } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as Events[]).includes(type)) {
      const isPrevious = action === ACTIONS.PREV;
      const nextStepIndex = index + (isPrevious ? -1 : 1);

      if (sidebarOpen && index === 1) {
        setState({
          sidebarOpen: !isPrevious,
          stepIndex: nextStepIndex,
        });
      } else if (sidebarOpen && index === 2) {
        setState({
          sidebarOpen: isPrevious,
          stepIndex: nextStepIndex,
        });
      } else if (index === 3 && action === ACTIONS.PREV) {
        setState({
          sidebarOpen: true,
          stepIndex: nextStepIndex,
        });
      } else {
        // Update state to advance the tour
        setState({
          sidebarOpen: false,
          stepIndex: nextStepIndex,
        });
      }
    }

    logGroup(type === EVENTS.TOUR_STATUS ? `${type}:${status}` : type, data);
  };

  const handleClickOpen = () => {
    setState({
      sidebarOpen: !sidebarOpen,
      stepIndex: stepIndex === 0 ? 1 : stepIndex,
    });
  };

  const handleStateChange = ({ isOpen }: StateChange) => {
    setState({ sidebarOpen: isOpen });
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] bg-gray-700 p-8 ">
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        locale={{
          nextLabelWithProgress: 'Next ({step} of {steps})',
        }}
        run={run}
        scrollToFirstStep
        stepIndex={stepIndex}
        stepOptions={{
          showProgress: true,
          showSkipButton: true,
        }}
        steps={steps}
      />
      <Sidebar
        disclaimerRef={disclaimerRef}
        handleStateChange={handleStateChange}
        sidebarOpen={sidebarOpen}
        sidebarRef={sidebarRef}
      />
      <Button
        ref={menuRef}
        aria-label="Toggle Sidebar"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        isIconOnly
        onPress={handleClickOpen}
      >
        <MenuIcon aria-hidden="true" color="#f04" size={24} />
      </Button>
      <div className="flex flex-col flex-1 min-h-0" id="innerContainer">
        <h1 className="text-4xl font-bold text-center text-white mb-2">DASHBOARD</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 flex-1 min-h-0">
          <Calendar ref={calendarRef} />
          <Growth ref={growthRef} />
          <Users ref={usersRef} />
          <Connections ref={connectionsRef} />
        </div>
      </div>
    </div>
  );
}
