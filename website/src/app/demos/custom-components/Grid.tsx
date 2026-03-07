import {
  BookOpenIcon,
  GlobeIcon,
  HeartIcon,
  RocketIcon,
  SparklesIcon,
  UsersIcon,
} from 'lucide-react';

const cards = [
  {
    icon: RocketIcon,
    title: 'Our Projects',
    description: 'Building tools that empower developers worldwide.',
    color: 'bg-blue-500',
  },
  {
    icon: GlobeIcon,
    title: 'Our Mission',
    description: 'Making the web more accessible, one component at a time.',
    color: 'bg-emerald-500',
  },
  {
    icon: BookOpenIcon,
    title: 'Documentation',
    description: 'Comprehensive guides and examples for every feature.',
    color: 'bg-amber-500',
  },
  {
    icon: SparklesIcon,
    title: 'The Good Stuff',
    description: 'Custom themes, animations, and advanced configurations.',
    color: 'bg-purple-500',
  },
  {
    icon: UsersIcon,
    title: 'Community',
    description: 'Join thousands of developers building better experiences.',
    color: 'bg-rose-500',
  },
  {
    icon: HeartIcon,
    title: 'Open Source',
    description: 'Free forever. Contributions welcome.',
    color: 'bg-cyan-500',
  },
];

export default function Grid() {
  return (
    <div className="flex items-center justify-center">
      <div className="image-grid grid grid-cols-1 lg:grid-cols-3 gap-6 p-8 w-full">
        {cards.map(card => (
          <div
            key={card.title}
            className="bg-white dark:bg-danger-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`${card.color} size-12 rounded-lg flex items-center justify-center mb-4`}
            >
              <card.icon className="size-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 dark:text-white">{card.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
