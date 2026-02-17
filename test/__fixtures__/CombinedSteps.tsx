import { useRef, useState } from 'react';

import Joyride, { CallBackProps, Status, STATUS, Step, StoreHelpers } from '../../src';

const steps: Array<Step> = [
  {
    content: <h2>Let's begin our journey!</h2>,
    locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
    placement: 'center',
    target: 'body',
  },
  {
    target: '.projects h2 span',
    placement: 'bottom',
    content: 'The first step of many! Keep walking!',
  },
  {
    target: '.mission button',
    placement: 'bottom',
    content: 'Can be advanced by clicking an element through the overlay hole.',
    title: 'Our Mission',
    spotlightClicks: true,
  },
  {
    target: '.about h2 span',
    placement: 'bottom',
    content: (
      <div>
        <h3>We are the people</h3>
        <svg
          height="96px"
          preserveAspectRatio="xMidYMid"
          version="1.1"
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
  },
  {
    target: '.not-mounted',
    content: 'This step tests what happens when a target is missing',
    title: 'Unmounted target',
  },
  {
    target: 'header button',
    content: 'This is a fixed element. It should be properly positioned.',
    title: 'Fixed element',
  },
  {
    content: 'The latest version of React!',
    placement: 'bottom',
    target: '.scroll-content h3:nth-of-type(1)',
  },
  {
    content: 'Yay! Server components',
    placement: 'top',
    target: '.scroll-content h3:nth-of-type(2)',
  },
  {
    content: 'This is the way.',
    placement: 'top',
    target: '.scroll-content h3:nth-of-type(3)',
  },
  {
    content: 'Code, Debug, Repeat.',
    placement: 'top',
    target: '.scroll-content h3:nth-of-type(4)',
  },
  {
    content: 'Several exciting features',
    placement: 'top',
    target: '.scroll-content h3:nth-of-type(6)',
  },
  {
    target: '.demo__footer button',
    placement: 'top',
    content: "Text only steps — Because sometimes you don't really need a proper heading",
  },
  {
    target: 'body',
    placement: 'center',
    content: "That's it folks!",
    styles: {
      tooltipContent: {
        textAlign: 'center',
      },
    },
  },
];

export default function CombinedSteps() {
  const [run, setRun] = useState(false);
  const helpersRef = useRef<StoreHelpers>(null);

  const handleClickStart = () => {
    setRun(true);
  };

  const handleClickMissionButton = () => {
    helpersRef.current?.next();
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as Array<Status>).includes(status)) {
      setRun(false);
    }

    console.log(data);
  };

  return (
    <div data-test-id="demo">
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        getHelpers={helpers => {
          helpersRef.current = helpers;
        }}
        run={run}
        scrollToFirstStep
        showSkipButton
        steps={steps}
      />
      <header className="fixed-header">
        <button className="icon-only" type="button">
          ☀️
        </button>
      </header>
      <main>
        <div className="hero">
          <div className="container">
            <div className="hero__content">
              <h1>
                <span>Create walkthroughs and guided tours for your ReactJS apps.</span>
              </h1>
              <button data-test-id="start" onClick={handleClickStart} type="button">
                Start here!
              </button>
            </div>
          </div>
        </div>
        <div className="demo__section projects">
          <div className="container">
            <h2>
              <span>Projects</span>
            </h2>
            <div className="list">
              <div>Installation</div>
              <div>Documentation</div>
              <div>Support</div>
            </div>
          </div>
        </div>

        <div className="demo__section mission">
          <div className="container">
            <h2>
              <span>Mission</span>
            </h2>

            <button data-test-id="mission-button" onClick={handleClickMissionButton} type="button">
              Spotlight Click
            </button>
          </div>
        </div>
        <div className="demo__section about">
          <div className="container">
            <h2>
              <span>About</span>
            </h2>
          </div>
        </div>
        <div className="demo__section scroll">
          <h2>Works with custom scrolling parents!</h2>
          <div className="scroll-content">
            <h3>New Features in React 18</h3>
            <p>
              React 18 has arrived with a host of new features and improvements, offering developers
              even more power and flexibility in building user interfaces. This latest version
              brings some significant updates that aim to enhance performance, ease development
              workflows, and provide better developer experience overall. Let&apos;s delve into the
              exciting new features in React 18:
            </p>

            <h3>1. React Server Components</h3>
            <p>
              React Server Components is a groundbreaking addition to React 18, introducing a new
              programming model that allows developers to build components that run on the server.
              With server components, you can fetch and compute data on the server, providing faster
              rendering and a more efficient use of resources. This feature enables rendering
              dynamic components on the server and transferring only the essential state updates to
              the client, resulting in improved performance and reduced time to interactive
              experiences.
            </p>

            <h3>2. Automatic JSX Transform</h3>
            <p>
              React 18 simplifies the development process by introducing automatic JSX transform. In
              previous versions, developers needed to set up tooling to transform JSX syntax into
              JavaScript code that React could understand. With React 18, this transformation is
              automatically handled by React itself, eliminating the need for additional build
              configurations and reducing the setup complexity.
            </p>

            <h3>3. Suspense SSR</h3>
            <p>
              React 18 enhances Server-Side Rendering (SSR) capabilities with the introduction of
              Suspense SSR. SSR is the process of rendering React components on the server and
              sending the pre-rendered HTML to the client for faster initial page loads and improved
              SEO. Suspense SSR allows developers to use the Suspense component to declaratively
              handle data fetching and code-splitting during the server rendering process, enabling
              better control and optimization of server-rendered content.
            </p>

            <h3>4. React Refresh</h3>
            <p>
              Building on the success of Fast Refresh, React 18 introduces React Refresh, a new
              hot-reloading feature that provides a more reliable and stable development experience.
              React Refresh allows you to make changes to your code while preserving the component
              state, avoiding unnecessary full reloads of the application, and providing faster
              turnaround times during development.
            </p>

            <h3>5. Improved DevTools</h3>
            <p>
              React 18 comes with enhanced Developer Tools that provide a more intuitive and
              insightful debugging experience. The updated DevTools offer improved support for
              profiling, identifying performance bottlenecks, and understanding component
              re-renders. This helps developers optimize their applications and deliver better
              performance to end-users.
            </p>

            <h3>In Conclusion</h3>
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
        </div>
      </main>
      <footer className="demo__footer">
        <button type="button">Joyride</button>
      </footer>
    </div>
  );
}
