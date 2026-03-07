import { cn } from '@heroui/react';
import {
  AtSignIcon,
  BoldIcon,
  HashIcon,
  ItalicIcon,
  ListIcon,
  PaperclipIcon,
  PlusIcon,
  SendHorizonalIcon,
  SettingsIcon,
  SmileIcon,
  UsersIcon,
} from 'lucide-react';

interface MessageAreaProps {
  className?: string;
}

const messages = [
  {
    id: 1,
    user: 'Alice Chen',
    initials: 'AC',
    color: 'bg-blue-500',
    time: '10:30 AM',
    text: 'Hey team! The new design system components are ready for review.',
  },
  {
    id: 2,
    user: 'Bob Smith',
    initials: 'BS',
    color: 'bg-green-600',
    time: '10:32 AM',
    text: "Nice work! I'll take a look after lunch.",
  },
  {
    id: 3,
    user: 'Carol Davis',
    initials: 'CD',
    color: 'bg-purple-500',
    time: '10:35 AM',
    text: 'The color tokens look great. Should we also update the typography scale?',
    reactions: [
      { emoji: '👍', count: 3 },
      { emoji: '❤️', count: 2 },
      { emoji: '🚀', count: 1 },
    ],
  },
  {
    id: 4,
    user: 'Alice Chen',
    initials: 'AC',
    color: 'bg-blue-500',
    time: '10:38 AM',
    text: "Good idea! I'll add that to the sprint backlog.",
  },
  {
    id: 5,
    user: 'Dev Bot',
    initials: 'DB',
    color: 'bg-gray-500',
    time: '10:40 AM',
    text: 'Build #142 passed. All 47 tests green. ✅',
  },
];

function ComposerButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded-md text-gray-400 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-200 transition-colors',
        className,
      )}
      type="button"
    >
      {children}
    </button>
  );
}

export default function MessageArea({ className }: MessageAreaProps) {
  return (
    <div
      className={cn(
        'flex flex-col flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
        className,
      )}
    >
      {/* Header */}
      <div className="chat__header flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <HashIcon className="text-gray-400" size={18} />
          <span className="font-bold">general</span>
        </div>
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <button
            className="flex items-center gap-1 text-xs hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            type="button"
          >
            <UsersIcon size={14} />
            <span>128</span>
          </button>
          <button
            className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            type="button"
          >
            <SettingsIcon size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="chat__tabs flex items-center gap-1 px-4 py-1.5 border-b border-gray-200 dark:border-gray-700 text-sm">
        <button
          className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 font-medium text-gray-900 dark:text-white"
          type="button"
        >
          Messages
        </button>
        <button
          className="px-3 py-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          type="button"
        >
          Files
        </button>
        <button
          className="flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          type="button"
        >
          <PlusIcon size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="chat__messages flex-1 overflow-y-auto px-4 py-2">
        {messages.map(message => (
          <div key={message.id} className="flex gap-3 py-2 group">
            <span
              className={cn(
                'flex items-center justify-center w-9 h-9 rounded-lg text-white text-xs font-bold shrink-0',
                message.color,
              )}
            >
              {message.initials}
            </span>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-sm">{message.user}</span>
                <span className="text-xs text-gray-400">{message.time}</span>
              </div>
              <p className="text-sm mt-0.5">{message.text}</p>
              {message.reactions && (
                <div className="chat__reactions flex gap-1.5 mt-1.5">
                  {message.reactions.map(reaction => (
                    <button
                      key={reaction.emoji}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-xs hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      type="button"
                    >
                      <span>{reaction.emoji}</span>
                      <span className="text-gray-600 dark:text-gray-300">{reaction.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="chat__composer mx-4 mb-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
        <div className="px-3 py-2">
          <div className="text-sm text-gray-400" contentEditable={false}>
            Message #general
          </div>
        </div>
        <div className="flex items-center justify-between px-2 py-1.5 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-0.5">
            <ComposerButton className="chat__attachments">
              <PaperclipIcon size={16} />
            </ComposerButton>
            <div className="chat__formatting flex items-center gap-0.5">
              <ComposerButton>
                <BoldIcon size={16} />
              </ComposerButton>
              <ComposerButton>
                <ItalicIcon size={16} />
              </ComposerButton>
              <ComposerButton>
                <ListIcon size={16} />
              </ComposerButton>
            </div>
            <span className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />
            <ComposerButton className="chat__mentions">
              <AtSignIcon size={16} />
            </ComposerButton>
            <ComposerButton className="chat__emoji">
              <SmileIcon size={16} />
            </ComposerButton>
          </div>
          <button
            className="chat__send flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            type="button"
          >
            <SendHorizonalIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
