import { useState } from 'react';
import { Button, cn, Tooltip } from '@heroui/react';
import { FlaskConicalIcon } from 'lucide-react';

import ConfigDrawer from './ConfigDrawer';

const STORAGE_KEY = 'react-joyride-fab-seen';

interface ConfigPanelFABProps {
  className?: string;
}

export default function ConfigPanelFAB({ className }: ConfigPanelFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [seen, setSeen] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  const handlePress = () => {
    if (!seen) {
      setSeen(true);
      localStorage.setItem(STORAGE_KEY, 'true');
    }

    setIsOpen(true);
  };

  return (
    <>
      <Tooltip
        classNames={{
          base: 'before:right-5!',
        }}
        content="Customize the Tour"
        {...(!seen ? { isOpen: true } : {})}
        placement="bottom-end"
        showArrow
      >
        <Button
          className={cn('fixed top-20 right-6 z-120 shadow-lg', className)}
          color="primary"
          isIconOnly
          onPress={handlePress}
          radius="full"
          size="lg"
        >
          <FlaskConicalIcon size={24} />
        </Button>
      </Tooltip>
      <ConfigDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
