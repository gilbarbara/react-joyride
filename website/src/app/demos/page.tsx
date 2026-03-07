import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Demos',
};

const demos = [
  {
    href: '/demos/overview',
    title: 'Overview',
    description: 'A guided tour showcasing core features.',
  },
  {
    href: '/demos/chat',
    title: 'Chat App',
    description: 'Tour inside a team communication workspace.',
  },
  {
    href: '/demos/controlled',
    title: 'Dashboard (Controlled)',
    description: 'Programmatic control with the useJoyride hook.',
  },
  {
    href: '/demos/multi-route',
    title: 'Multi Route',
    description: 'Tour that spans multiple routes with dynamic steps.',
  },
  {
    href: '/demos/carousel',
    title: 'Carousel',
    description: 'Tour integrated with an image carousel.',
  },
  {
    href: '/demos/custom-components',
    title: 'Custom Components',
    description: 'Custom arrow, beacon, tooltip, and programmatic controls.',
  },
  {
    href: '/demos/scroll',
    title: 'Scroll',
    description: 'Tour inside a custom scrolling container.',
  },
  { href: '/demos/modal', title: 'Modal', description: 'Tour inside modal dialogs.' },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8">
      <h1 className="text-4xl font-bold mb-2">Demos</h1>
      <p className="text-lg text-default-500 mb-8">Custom pages to showcase all the features</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full">
        {demos.map(demo => (
          <Link
            key={demo.href}
            className="p-6 rounded-lg border border-crimson hover:shadow-md transition-all no-underline text-foreground"
            href={demo.href}
          >
            <h2 className="text-lg font-bold mb-1 text-crimson">{demo.title}</h2>
            <p className="text-sm text-default-500">{demo.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
