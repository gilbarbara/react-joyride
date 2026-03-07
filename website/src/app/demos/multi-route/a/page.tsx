'use client';

import { Button, Card, CardBody } from '@heroui/react';
import { useRouter } from 'next/navigation';

import { useMultiRouteContext } from '~/context/MultiRouteContext';

const items = [
  { title: 'Sprint Review', date: 'Mar 14', status: 'In Progress' },
  { title: 'Design Handoff', date: 'Mar 15', status: 'Upcoming' },
  { title: 'Deploy v3.0', date: 'Mar 18', status: 'Upcoming' },
];

export default function RouteA() {
  const router = useRouter();
  const { run } = useMultiRouteContext();

  return (
    <div className="p-6 w-full max-w-3xl mx-auto">
      <div id="routeA">
        <h2 className="text-center text-3xl font-bold text-secondary mb-6">Route A</h2>
        <div className="space-y-3 max-w-lg mx-auto">
          {items.map(item => (
            <Card key={item.title} shadow="sm">
              <CardBody className="flex flex-row items-center justify-between">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-default-500">{item.date}</p>
                </div>
                <span className="text-xs text-default-400">{item.status}</span>
              </CardBody>
            </Card>
          ))}
        </div>
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
