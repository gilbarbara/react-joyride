'use client';

import { Button, Card, CardBody } from '@heroui/react';
import { BarChart3Icon, ShieldIcon, UsersIcon, ZapIcon } from 'lucide-react';

import { useMultiRouteContext } from '~/context/MultiRouteContext';

const stats = [
  { icon: UsersIcon, label: 'Active Users', value: '12,847' },
  { icon: BarChart3Icon, label: 'Revenue', value: '$48.2K' },
  { icon: ZapIcon, label: 'Uptime', value: '99.9%' },
  { icon: ShieldIcon, label: 'Security Score', value: 'A+' },
];

export default function Home() {
  const { onStart, run } = useMultiRouteContext();

  return (
    <div className="p-6 w-full max-w-3xl mx-auto">
      <div className="mb-8" id="home">
        <h2 className="text-center text-3xl font-bold text-secondary mb-6">Home</h2>
        <div className="grid grid-cols-2 gap-4">
          {stats.map(stat => (
            <Card key={stat.label} shadow="sm">
              <CardBody className="flex flex-row items-center gap-3">
                <stat.icon className="size-5 text-secondary" />
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-default-500">{stat.label}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
      {!run && (
        <div className="flex items-center justify-center">
          <Button className="font-bold" color="secondary" onPress={onStart} size="lg">
            Start the tour
          </Button>
        </div>
      )}
    </div>
  );
}
