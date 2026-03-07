import { CompassIcon, GaugeIcon, MousePointerClickIcon } from 'lucide-react';

import Section from './Section';

const howItWorks = [
  {
    icon: MousePointerClickIcon,
    step: '1',
    title: 'Define Steps',
    description: 'Create an array of steps with targets, content, and options.',
  },
  {
    icon: GaugeIcon,
    step: '2',
    title: 'Configure',
    description: 'Set tour behavior: continuous mode, scrolling, callbacks.',
  },
  {
    icon: CompassIcon,
    step: '3',
    title: 'Launch',
    description: 'Set run to true and the tour guides your users.',
  },
];

interface HowItWorksProps {
  withHeader: boolean;
}

export default function HowItWorks({ withHeader }: HowItWorksProps) {
  return (
    <Section className="demo__how-it-works bg-green" withHeader={withHeader}>
      <div className="demo__how-it-works__content w-full max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map(item => (
            <div
              key={item.step}
              className="demo__how-it-works-card flex flex-col items-center text-center gap-3"
            >
              <div className="size-12 rounded-full bg-background text-green flex items-center justify-center text-2xl font-bold mb-4">
                {item.step}
              </div>
              <div className="flex flex-col items-center bg-black/20 p-4 rounded-large">
                <item.icon className="size-8" />
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-white/80">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
