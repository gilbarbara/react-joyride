import { Button, Link } from '@heroui/react';

import Maze from '~/components/Maze';
import PackageManagerSelector from '~/components/PackageManagerSelector';

const features = [
  {
    title: 'Easy Setup',
    description:
      'Add guided tours to your React app with minimal configuration. Just define your steps and go.',
  },
  {
    title: 'Fully Customizable',
    description:
      'Custom components, styles, and behaviors. Use your own beacon, tooltip, or overlay.',
  },
  {
    title: 'Accessible',
    description:
      'Built-in focus trap, keyboard navigation, and ARIA attributes for screen readers.',
  },
  {
    title: 'Event-Driven',
    description:
      'Rich event system for full control over tour flow. Build controlled or uncontrolled tours.',
  },
];

export default function Home() {
  return (
    <div className="relative flex flex-col flex-1 overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,0,68,0.14),transparent_55%),linear-gradient(180deg,transparent_0%,rgba(255,0,68,0.04)_100%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,0,68,0.22),transparent_55%),linear-gradient(180deg,transparent_0%,rgba(255,0,68,0.08)_100%)]">
      <div className="flex flex-col items-center justify-center text-center w-full max-w-7xl mx-auto py-10 xs:py-16 md:py-28 px-4 sm:px-8 relative">
        <Maze aria-hidden className="size-32 md:size-64 mb-8" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance mb-3 md:mb-4">
          React Joyride
        </h1>
        <p className="text-lg sm:text-xl text-default-600 mb-8 max-w-2xl text-pretty leading-relaxed">
          Create guided tours and walkthroughs for your React apps. Showcase features to new users
          or explain how things work.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Button as={Link} color="primary" href="/docs/getting-started" size="lg">
            Get Started
          </Button>
          <Button as={Link} color="primary" href="/demos" size="lg" variant="bordered">
            View Demos
          </Button>
        </div>
        <div className="mt-8 w-full max-w-82 flex justify-center">
          <PackageManagerSelector justify="center" />
        </div>
      </div>
      <section
        aria-label="Features"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl w-full mx-auto px-4 sm:px-8 pb-16"
      >
        {features.map(feature => (
          <div
            key={feature.title}
            className="p-5 sm:p-6 rounded-lg border border-crimson bg-content1"
          >
            <h2 className="text-lg text-crimson font-semibold mb-2">{feature.title}</h2>
            <p className="text-default-600 text-sm sm:text-base leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
