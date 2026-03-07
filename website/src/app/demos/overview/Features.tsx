import { addToast, Button, Card, CardBody } from '@heroui/react';
import { CompassIcon, PuzzleIcon, SettingsIcon, ZapIcon } from 'lucide-react';

import Section from './Section';

const features = [
  {
    icon: ZapIcon,
    title: 'Hooks API',
    description:
      "New in V3 — useJoyride() puts you in the driver's seat with a complete imperative API.",
  },
  {
    icon: PuzzleIcon,
    title: 'Custom Components',
    description: 'Replace beacons, tooltips, and arrows with your own components.',
  },
  {
    icon: CompassIcon,
    title: 'Smart Scrolling',
    description: 'Auto-scrolls to each target. Use scrollTarget and scrollOffset to fine-tune.',
  },
  {
    icon: SettingsIcon,
    title: 'Fully Configurable',
    description: 'Control every aspect: placement, buttons, callbacks, styling, and more.',
  },
];

interface FeaturesProps {
  showDisableInteraction: boolean;
  withHeader: boolean;
}

export default function Features({ showDisableInteraction, withHeader }: FeaturesProps) {
  return (
    <Section className="demo__features bg-orange" withHeader={withHeader}>
      <div className="demo__features__content w-full max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(feature => (
            <Card
              key={feature.title}
              className="demo__feature-card bg-black/10 backdrop-blur-sm border-none"
            >
              <CardBody className="items-center text-center text-white p-4 pb-4">
                <feature.icon className="size-10 mb-4" />
                <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
                <p className="text-sm mb-2">{feature.description}</p>
                <div className="h-8">
                  {showDisableInteraction && feature.title === 'Custom Components' && (
                    <Button
                      color="primary"
                      onPress={() => {
                        addToast({
                          title: 'Interaction Disabled',
                          description: 'You have disabled interaction for this step.',
                        });
                      }}
                      size="sm"
                    >
                      Click Me!
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
