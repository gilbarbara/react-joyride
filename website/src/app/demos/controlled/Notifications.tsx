import type { RefObject } from 'react';
import { Button } from '@heroui/react';
import {
  BellIcon,
  CheckCheckIcon,
  GitPullRequestIcon,
  MessageSquareIcon,
  RocketIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  ZapIcon,
} from 'lucide-react';

import Collapse from '~/components/Collapse';

const notifications = [
  {
    group: 'Today',
    items: [
      { icon: UserPlusIcon, color: 'text-blue-500', text: 'New user signed up', time: '2m ago' },
      {
        icon: RocketIcon,
        color: 'text-green-500',
        text: 'Deployment succeeded',
        time: '15m ago',
      },
      {
        icon: MessageSquareIcon,
        color: 'text-purple-500',
        text: 'Comment on PR #42',
        time: '1h ago',
      },
      {
        icon: ShieldCheckIcon,
        color: 'text-emerald-500',
        text: 'Security scan passed',
        time: '2h ago',
      },
    ],
  },
  {
    group: 'Yesterday',
    items: [
      {
        icon: ZapIcon,
        color: 'text-amber-500',
        text: 'Build time improved 23%',
        time: '18h ago',
      },
      {
        icon: GitPullRequestIcon,
        color: 'text-rose-500',
        text: 'PR #38 merged',
        time: '22h ago',
      },
      {
        icon: UserPlusIcon,
        color: 'text-blue-500',
        text: '3 new team invites',
        time: '23h ago',
      },
    ],
  },
  {
    group: 'Older',
    items: [
      {
        icon: RocketIcon,
        color: 'text-green-500',
        text: 'v2.8.1 released',
        time: '3d ago',
      },
      {
        icon: MessageSquareIcon,
        color: 'text-purple-500',
        text: 'Feedback from beta users',
        time: '4d ago',
      },
      {
        icon: ShieldCheckIcon,
        color: 'text-emerald-500',
        text: 'Dependencies updated',
        time: '5d ago',
      },
      {
        icon: GitPullRequestIcon,
        color: 'text-rose-500',
        text: 'PR #35 needs review',
        time: '5d ago',
      },
      {
        icon: ZapIcon,
        color: 'text-amber-500',
        text: 'CI pipeline optimized',
        time: '6d ago',
      },
      {
        icon: UserPlusIcon,
        color: 'text-blue-500',
        text: 'New contributor joined',
        time: '1w ago',
      },
    ],
  },
];

interface NotificationsProps {
  isOpen: boolean;
  markAsReadRef: RefObject<HTMLButtonElement | null>;
  noticationsRef: RefObject<HTMLDivElement | null>;
  onChange: (isOpen: boolean) => void;
  onChangeButton: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export default function Notifications(props: NotificationsProps) {
  const { isOpen, markAsReadRef, noticationsRef, onChangeButton, triggerRef } = props;

  return (
    <div className="absolute left-8 top-4">
      <Button
        ref={triggerRef}
        aria-label="Toggle Notifications"
        className="bg-slate-500"
        isIconOnly
        onPress={onChangeButton}
      >
        <BellIcon aria-hidden="true" color="#fff" size={24} />
      </Button>
      <Collapse
        className="absolute top-full -left-2 translate-y-2 w-xs bg-white dark:bg-slate-800 rounded-lg shadow-lg z-50"
        isOpen={isOpen}
      >
        <div
          ref={noticationsRef}
          className=" w-full max-w-sm max-h-128 overflow-y-auto"
          id="notifications"
        >
          <div className="sticky top-0 flex items-center gap-2 p-4 bg-white dark:bg-slate-800">
            <BellIcon className="size-5" />
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>
          <div className="flex flex-col gap-3 pt-0 p-4 pb-8">
            {notifications.map(group => (
              <div key={group.group}>
                <p className="text-xs font-semibold text-foreground-400 uppercase tracking-wide mb-2">
                  {group.group}
                </p>
                <div className="flex flex-col gap-2">
                  {group.items.map(item => (
                    <div
                      key={item.text}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-foreground-100 transition-colors h-13"
                    >
                      <item.icon className={`size-4 mt-0.5 shrink-0 ${item.color}`} />
                      <div className="min-w-0">
                        <p className="text-sm leading-tight">{item.text}</p>
                        <p className="text-xs text-foreground-400">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button
              ref={markAsReadRef}
              className="w-full mt-4"
              size="sm"
              startContent={<CheckCheckIcon className="size-4" />}
              variant="flat"
            >
              Mark all as read
            </Button>
          </div>
        </div>
      </Collapse>
    </div>
  );
}
