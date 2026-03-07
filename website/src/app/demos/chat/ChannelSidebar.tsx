import { cn } from '@heroui/react';
import { ChevronDownIcon, HashIcon, SearchIcon } from 'lucide-react';

interface ChannelSidebarProps {
  className?: string;
}

const channels = [
  { name: 'general', active: true },
  { name: 'engineering' },
  { name: 'design' },
  { name: 'random' },
  { name: 'announcements', unread: true },
];

const directMessages = [
  { name: 'Alice Chen', initials: 'AC', color: 'bg-blue-500', online: true },
  { name: 'Bob Smith', initials: 'BS', color: 'bg-green-600', online: false },
  { name: 'Carol Davis', initials: 'CD', color: 'bg-purple-500', online: true },
];

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="flex items-center gap-1 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-indigo-300/60 hover:text-gray-700 dark:hover:text-indigo-200 transition-colors text-left"
      type="button"
    >
      <ChevronDownIcon size={12} />
      {children}
    </button>
  );
}

export default function ChannelSidebar({ className }: ChannelSidebarProps) {
  return (
    <div
      className={cn(
        'flex flex-col w-60 bg-indigo-50 dark:bg-indigo-900 text-gray-800 dark:text-gray-200',
        className,
      )}
    >
      <div className="chat__search flex items-center gap-2 mx-3 mt-3 mb-2 px-3 py-1.5 rounded-md bg-white/60 dark:bg-black/20 text-gray-400 dark:text-indigo-300 text-sm">
        <SearchIcon size={14} />
        <span>Search...</span>
      </div>

      <SectionHeader>Channels</SectionHeader>
      <div className="channel-list flex flex-col px-2 mb-2">
        {channels.map(channel => (
          <button
            key={channel.name}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-md text-sm transition-colors text-left',
              channel.active
                ? 'bg-indigo-200/60 dark:bg-indigo-700/50 text-indigo-900 dark:text-white font-semibold'
                : 'text-gray-600 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-800/50',
            )}
            type="button"
          >
            <HashIcon className="shrink-0 opacity-60" size={14} />
            <span className="truncate">{channel.name}</span>
            {channel.unread && (
              <span className="ml-auto w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-300 shrink-0" />
            )}
          </button>
        ))}
      </div>

      <SectionHeader>Direct Messages</SectionHeader>
      <div className="flex flex-col px-2">
        {directMessages.map(dm => (
          <button
            key={dm.name}
            className="flex items-center gap-2 px-2 py-1 rounded-md text-sm text-gray-600 dark:text-indigo-200 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition-colors text-left"
            type="button"
          >
            <span className="relative shrink-0">
              <span
                className={cn(
                  'flex items-center justify-center w-6 h-6 rounded-md text-white text-[10px] font-bold',
                  dm.color,
                )}
              >
                {dm.initials}
              </span>
              <span
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-indigo-50 dark:border-indigo-900',
                  dm.online ? 'bg-green-500' : 'bg-gray-400',
                )}
              />
            </span>
            <span className="truncate">{dm.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
