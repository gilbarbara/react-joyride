'use client';

import { Button, Card, CardBody } from '@heroui/react';
import { useRouter } from 'next/navigation';

import { useMultiRouteContext } from '~/context/MultiRouteContext';

const metrics = [
  { label: 'Page Views', current: '24.5K', change: '+12%' },
  { label: 'Bounce Rate', current: '32%', change: '-5%' },
  { label: 'Avg. Session', current: '4m 12s', change: '+8%' },
];

export default function RouteB() {
  const router = useRouter();
  const { hasNewStep, onNewStep, run } = useMultiRouteContext();

  return (
    <div className="p-6 w-full max-w-3xl mx-auto">
      <div id="routeB">
        <h2 className="text-center text-3xl font-bold text-secondary mb-6">Route B</h2>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {metrics.map(metric => (
            <Card key={metric.label} shadow="sm">
              <CardBody className="text-center">
                <p className="text-xl font-bold">{metric.current}</p>
                <p className="text-xs text-default-500">{metric.label}</p>
                <p className="text-xs text-success-600 font-medium">{metric.change}</p>
              </CardBody>
            </Card>
          ))}
        </div>
        {run && (
          <div className="flex justify-center mt-6">
            <Button
              color="primary"
              id="learn-more"
              isDisabled={hasNewStep}
              onPress={onNewStep}
              size="lg"
            >
              {hasNewStep ? 'Step added!' : 'Click here to add a dynamic step to the tour'}
            </Button>
          </div>
        )}
      </div>
      {!run && (
        <div className="text-center mt-6">
          <Button
            color="secondary"
            onPress={() => {
              router.push('/demos/multi-route');
            }}
          >
            Back to Home
          </Button>
        </div>
      )}
    </div>
  );
}
