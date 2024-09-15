import { useEffect, useReducer, useRef } from 'react';

import Beacon from './Beacon';
import Tooltip from './Tooltip';

import Joyride, { ACTIONS, EVENTS, STATUS } from '../../src';
import { CallBackProps, Props, Step } from '../../src/types';

interface ControlledProps extends Omit<Props, 'run' | 'steps'> {}

interface State {
  run: boolean;
  sidebarOpen: boolean;
  stepIndex: number;
  steps: Array<Step>;
}

export default function Controlled(props: ControlledProps) {
  const { callback } = props;
  const [{ run, sidebarOpen, stepIndex, steps }, setState] = useReducer(
    (previousState: State, nextState: Partial<State>) => ({
      ...previousState,
      ...nextState,
    }),
    {
      run: false,
      sidebarOpen: false,
      stepIndex: 0,
      steps: [],
    },
  );

  const calendar = useRef<HTMLDivElement>(null);
  const connections = useRef<HTMLDivElement>(null);
  const growth = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);
  const users = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
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
            target: menu.current!,
            title: 'Menu',
          },
          {
            content: 'This is our sidebar, you can find everything you need here',

            disableBeacon: true,
            placement: 'right',
            spotlightPadding: 0,
            styles: {
              options: {
                zIndex: 10000,
              },
            },
            target: sidebar.current!,
            title: 'Sidebar',
          },
          {
            content: 'Check the availability of the team!',
            disableBeacon: true,
            placement: 'bottom',
            styles: {
              options: {
                zIndex: 10000,
              },
            },
            target: calendar.current!,
            title: 'The schedule',
          },
          {
            content: <div>Our rate is off the charts!</div>,
            placement: 'bottom',
            spotlightClicks: true,
            target: growth.current!,
            title: 'Our Growth',
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
            target: users.current!,
            title: 'Our Users',
          },
          {
            content: 'The awesome connections you have made',
            placement: 'top',
            target: connections.current!,
          },
        ],
      });
    }, 1000);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setState({ run: false, stepIndex: 0 });
    } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      if (sidebarOpen && index === 0) {
        setTimeout(() => {
          setState({ run: true });
        }, 400);
      } else if (sidebarOpen && index === 1) {
        setState({
          run: false,
          sidebarOpen: false,
          stepIndex: nextStepIndex,
        });

        setTimeout(() => {
          setState({ run: true });
        }, 400);
      } else if (index === 2 && action === ACTIONS.PREV) {
        setState({
          run: false,
          sidebarOpen: true,
          stepIndex: nextStepIndex,
        });

        setTimeout(() => {
          setState({ run: true });
        }, 400);
      } else {
        // Update state to advance the tour
        setState({
          sidebarOpen: false,
          stepIndex: nextStepIndex,
        });
      }
    }

    callback?.(data);
  };

  const handleClickOpen = () => {
    setState({
      run: stepIndex === 0 ? false : run,
      sidebarOpen: !sidebarOpen,
      stepIndex: stepIndex === 0 ? 1 : stepIndex,
    });
  };

  const handleClickSidebar = () => {
    setState({ sidebarOpen: !sidebarOpen });
  };

  return (
    <div className="controlled-wrapper">
      <Joyride
        beaconComponent={Beacon}
        callback={handleJoyrideCallback}
        continuous
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        stepIndex={stepIndex}
        steps={steps}
        tooltipComponent={Tooltip}
      />
      <div className="controlled-container" data-test-id="controlled">
        <div
          ref={sidebar}
          className={`controlled-sidebar${sidebarOpen ? ' open' : ''}`}
          data-test-id="sidebar"
        >
          <div>
            <button
              className="controlled-sidebar-button"
              onClick={handleClickSidebar}
              type="button"
            >
              <img alt="close" src="https://files.gilbarbara.dev/icons/close.svg" />
            </button>
          </div>
          <p className="controlled-sidebar-item">Home</p>
          <p className="controlled-sidebar-item">Controlled</p>
          <p className="controlled-sidebar-item">Custom</p>
          <p className="controlled-sidebar-item">Modal</p>
          <p className="controlled-sidebar-item">Scroll</p>
        </div>
        <button
          ref={menu}
          className="controlled-menu"
          data-test-id="menu"
          onClick={handleClickOpen}
          type="button"
        >
          <img alt="menu" src="https://cdn.jsdelivr.net/npm/css.gg/icons/svg/menu.svg" />
        </button>
        <h1 className="controlled-heading">DASHBOARD</h1>
        <div className="controlled-sections">
          <div ref={calendar} className="controlled-section calendar">
            CALENDAR
          </div>
          <div ref={growth} className="controlled-section growth">
            GROWTH
          </div>
          <div ref={users} className="controlled-section users">
            USERS
          </div>
          <div ref={connections} className="controlled-section connections">
            CONNECTIONS
          </div>
        </div>
      </div>
    </div>
  );
}
