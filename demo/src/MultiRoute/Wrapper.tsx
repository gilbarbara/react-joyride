import Joyride, { type CallBackProps, EVENTS } from 'react-joyride';
import { Outlet, useNavigate } from 'react-router-dom';
import { useMount } from '@gilbarbara/hooks';

import { useAppContext } from './context';
import Header from './Header';

export default function MultiRouteWrapper() {
  const {
    setState,
    state: { run, stepIndex, steps },
  } = useAppContext();
  const navigate = useNavigate();

  useMount(() => {
    setState({
      steps: [
        {
          target: '#home',
          content: (
            <>
              <p className="font-bold text-lg">This is the home page</p>
              <p>
                When you click "next", it will stop the tour, navigate to route A, and continue the
                tour.
              </p>
            </>
          ),
          data: {
            next: '/multi-route/a',
          },
          disableBeacon: true,
        },
        {
          target: '#routeA',
          content: (
            <>
              <p className="font-bold text-lg">This is Route A</p>
              <p>
                The loader that appeared in the page was a simulation of a real page load, and now
                the tour is active again
              </p>
            </>
          ),
          data: {
            previous: '/multi-route',
            next: '/multi-route/b',
          },
          disableBeacon: true,
        },
        {
          target: '#routeB',
          content: (
            <>
              <p className="font-bold text-lg">This is Route B</p>
              <p>Yet another loader simulation and now we reached the last step in our tour!</p>
            </>
          ),
          data: {
            previous: '/multi-route/a',
            next: '/multi-route',
          },
          disableBeacon: true,
        },
      ],
    });
  });

  const handleCallback = (data: CallBackProps) => {
    const {
      action,
      index,
      step: {
        data: { next, previous },
      },
      type,
    } = data;
    const isPreviousAction = action === 'prev';

    if (type === EVENTS.STEP_AFTER) {
      if (index < 2) {
        setState({ run: false });
        navigate(isPreviousAction && previous ? previous : next);
      }

      if (index === 2) {
        if (isPreviousAction && previous) {
          setState({ run: false });
          navigate(previous);
        } else {
          setState({ run: false, stepIndex: 0, tourActive: false });
        }
      }
    }
  };

  return (
    <div className="bg-secondary-50 flex flex-col flex-1">
      <Header />
      <Outlet />
      <Joyride
        callback={handleCallback}
        continuous
        run={run}
        stepIndex={stepIndex}
        steps={steps}
        styles={{
          options: {
            arrowColor: '#000',
            backgroundColor: '#000',
            primaryColor: '#ad7bff',
            textColor: '#fff',
          },
        }}
      />
    </div>
  );
}
