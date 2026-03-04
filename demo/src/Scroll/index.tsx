import Joyride, { type EventData, type Step } from 'react-joyride';
import { useMount, useSetState } from '@gilbarbara/hooks';
// @ts-ignore
import a11yChecker from 'a11y-checker';

import Container from '~/components/Container';

import { logGroup } from '../modules/helpers';

interface State {
  run: boolean;
  steps: Step[];
}

export default function ScrollDemo() {
  const [{ run, steps }] = useSetState<State>({
    run: true,
    steps: [
      {
        content: 'The latest version of React!',
        placement: 'bottom' as const,
        target: '.app__scroller h2',
      },
      {
        content: 'Yay! Server components',
        placement: 'top' as const,
        target: '.app__scroller h3:nth-of-type(1)',
      },
      {
        content: 'This is the way.',
        placement: 'top' as const,
        target: '.app__scroller h3:nth-of-type(3)',
      },
      {
        content: 'Code, Debug, Repeat.',
        placement: 'top' as const,
        target: '.app__scroller h3:nth-of-type(4)',
      },
      {
        content: 'Several exciting features',
        placement: 'top' as const,
        target: '.app__scroller h3:nth-of-type(6)',
      },
    ],
  });

  useMount(() => {
    a11yChecker();
  });

  const handleEvent = (data: EventData) => {
    const { type } = data;

    logGroup(type, data);
  };

  return (
    <div className="bg-gray-200 flex flex-col flex-1">
      <Container className="items-center justify-center py-8">
        <Joyride continuous onEvent={handleEvent} run={run} scrollToFirstStep steps={steps} />
        <h1 className="text-4xl font-bold text-red mb-8">Works with custom scrolling parents!</h1>
        <div className="app__scroller bg-white h-[50vh] p-4 overflow-scroll">
          <h2 className="text-2xl font-bold mb-2">New Features in React 18</h2>
          <p>
            React 18 has arrived with a host of new features and improvements, offering developers
            even more power and flexibility in building user interfaces. This latest version brings
            some significant updates that aim to enhance performance, ease development workflows,
            and provide better developer experience overall. Let's delve into the exciting new
            features in React 18:
          </p>

          <h3 className="text-xl font-bold mt-4 mb-2">1. React Server Components</h3>
          <p>
            React Server Components is a groundbreaking addition to React 18, introducing a new
            programming model that allows developers to build components that run on the server.
            With server components, you can fetch and compute data on the server, providing faster
            rendering and a more efficient use of resources. This feature enables rendering dynamic
            components on the server and transferring only the essential state updates to the
            client, resulting in improved performance and reduced time to interactive experiences.
          </p>

          <h3 className="text-xl font-bold mt-4 mb-2">2. Automatic JSX Transform</h3>
          <p>
            React 18 simplifies the development process by introducing automatic JSX transform. In
            previous versions, developers needed to set up tooling to transform JSX syntax into
            JavaScript code that React could understand. With React 18, this transformation is
            automatically handled by React itself, eliminating the need for additional build
            configurations and reducing the setup complexity.
          </p>

          <h3 className="text-xl font-bold mt-4 mb-2">3. Suspense SSR</h3>
          <p>
            React 18 enhances Server-Side Rendering (SSR) capabilities with the introduction of
            Suspense SSR. SSR is the process of rendering React components on the server and sending
            the pre-rendered HTML to the client for faster initial page loads and improved SEO.
            Suspense SSR allows developers to use the Suspense component to declaratively handle
            data fetching and code-splitting during the server rendering process, enabling better
            control and optimization of server-rendered content.
          </p>

          <h3 className="text-xl font-bold mt-4 mb-2">4. React Refresh</h3>
          <p>
            Building on the success of Fast Refresh, React 18 introduces React Refresh, a new
            hot-reloading feature that provides a more reliable and stable development experience.
            React Refresh allows you to make changes to your code while preserving the component
            state, avoiding unnecessary full reloads of the application, and providing faster
            turnaround times during development.
          </p>

          <h3 className="text-xl font-bold mt-4 mb-2">5. Improved DevTools</h3>
          <p>
            React 18 comes with enhanced Developer Tools that provide a more intuitive and
            insightful debugging experience. The updated DevTools offer improved support for
            profiling, identifying performance bottlenecks, and understanding component re-renders.
            This helps developers optimize their applications and deliver better performance to
            end-users.
          </p>

          <h3 className="text-xl font-bold mt-4 mb-2">In Conclusion</h3>
          <p>
            React 18 introduces several exciting features that aim to improve performance,
            streamline development workflows, and enhance the overall developer experience. With
            server components, automatic JSX transform, Suspense SSR, React Refresh, and improved
            DevTools, React developers can benefit from increased flexibility, better performance,
            and more efficient development processes. As you dive into React 18, make sure to
            explore these new features and leverage their potential to build impressive,
            high-performing user interfaces. Happy coding!
          </p>
        </div>
      </Container>
    </div>
  );
}
