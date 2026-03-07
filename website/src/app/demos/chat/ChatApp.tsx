import { cn } from '@heroui/react';

import ChannelSidebar from './ChannelSidebar';
import IconSidebar from './IconSidebar';
import MessageArea from './MessageArea';

interface ChatAppProps {
  className?: string;
}

export default function ChatApp({ className }: ChatAppProps) {
  return (
    <div
      className={cn(
        'flex flex-1 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg',
        className,
      )}
    >
      <IconSidebar />
      <ChannelSidebar />
      <MessageArea />
    </div>
  );
}
