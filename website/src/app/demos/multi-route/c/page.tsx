'use client';

import { Button, Card, CardBody, Kbd } from '@heroui/react';
import { useRouter } from 'next/navigation';

import { useMultiRouteContext } from '~/context/MultiRouteContext';

const shortcuts = [
  { keys: ['⌘', 'K'], label: 'Search' },
  { keys: ['⌘', 'S'], label: 'Save' },
  { keys: ['⌘', 'Z'], label: 'Undo' },
  { keys: ['⌘', '⇧', 'P'], label: 'Command Palette' },
  { keys: ['⌘', '/'], label: 'Toggle Comment' },
  { keys: ['⌘', 'D'], label: 'Select Next Match' },
];

export default function RouteC() {
  const router = useRouter();
  const { run } = useMultiRouteContext();

  return (
    <div className="p-6 w-full max-w-3xl mx-auto">
      <div id="routeC">
        <h2 className="text-center text-3xl font-bold text-secondary mb-6">Tips</h2>
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {shortcuts.map(shortcut => (
            <Card key={shortcut.label} shadow="sm">
              <CardBody className="flex flex-row items-center justify-between">
                <span className="text-sm">{shortcut.label}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map(key => (
                    <Kbd key={key}>{key}</Kbd>
                  ))}
                </div>
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
