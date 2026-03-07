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
    <div className="flex flex-col flex-1">
      <div className="flex flex-col items-center justify-center text-center w-full max-w-7xl mx-auto py-8 xs:py-16 md:py-32 px-4 sm:px-8 relative">
        <Maze className="size-32 md:size-64 mb-8" />
        <h1 className="text-5xl font-bold mb-4">React Joyride</h1>
        <p className="text-xl mb-8 max-w-2xl">
          Create guided tours for your apps. Showcase features to new users or explain functionality
          with interactive walkthroughs.
        </p>
        <div className="flex gap-4">
          <Button as={Link} color="primary" href="/docs/getting-started" size="lg">
            Get Started
          </Button>
          <Button as={Link} color="primary" href="/demos" size="lg" variant="bordered">
            View Demos
          </Button>
        </div>
        <div className="mt-8">
          <PackageManagerSelector justify="center" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 pb-16">
        {features.map(feature => (
          <div key={feature.title} className="p-6 rounded-lg border border-crimson">
            <h3 className="text-lg text-crimson font-semibold mb-2">{feature.title}</h3>
            <p className="text-default-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
