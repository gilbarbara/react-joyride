import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@heroui/react';

import ConfigPanel from '~/components/ConfigPanel/ConfigPanel';

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfigDrawer(props: ConfigDrawerProps) {
  const { isOpen, onClose } = props;

  return (
    <Drawer
      backdrop="transparent"
      classNames={{ wrapper: 'z-1000', base: 'shadow-md' }}
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      radius="none"
      size="xs"
    >
      <DrawerContent>
        <DrawerHeader className="h-16 py-0 px-4 flex items-center border-b border-default">
          Customize the tour
        </DrawerHeader>
        <DrawerBody className="gap-0 p-0 overflow-hidden">
          <ConfigPanel />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
