import { cn } from '@heroui/react';
import { BellIcon, BookmarkIcon, HomeIcon, MessageSquareIcon, PlusIcon } from 'lucide-react';

interface IconSidebarProps {
  className?: string;
}

interface NavButtonProps {
  active?: boolean;
  badge?: number;
  children: React.ReactNode;
  className?: string;
}

function NavButton({ active, badge, children, className }: NavButtonProps) {
  return (
    <button
      className={cn(
        'relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors',
        active
          ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-white'
          : 'text-indigo-400 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 hover:text-indigo-700 dark:hover:text-indigo-200',
        className,
      )}
      type="button"
    >
      {children}
      {badge && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold">
          {badge}
        </span>
      )}
    </button>
  );
}

export default function IconSidebar({ className }: IconSidebarProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center w-16 py-3 gap-1 bg-indigo-100 dark:bg-indigo-950',
        className,
      )}
    >
      <button
        className="chat__workspace flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-sm mb-2"
        type="button"
      >
        RJ
      </button>

      <NavButton active className="chat__home">
        <HomeIcon size={20} />
      </NavButton>
      <NavButton className="chat__dms">
        <MessageSquareIcon size={20} />
      </NavButton>
      <NavButton badge={3} className="chat__notifications">
        <BellIcon size={20} />
      </NavButton>
      <NavButton className="chat__bookmarks">
        <BookmarkIcon size={20} />
      </NavButton>

      <div className="flex-1" />

      <button
        className="chat__create flex items-center justify-center w-10 h-10 rounded-full bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-300 dark:hover:bg-indigo-700 transition-colors"
        type="button"
      >
        <PlusIcon size={20} />
      </button>

      <button
        className="chat__profile flex items-center justify-center w-9 h-9 rounded-full bg-emerald-600 text-white text-xs font-bold mt-1"
        type="button"
      >
        You
      </button>
    </div>
  );
}
