'use client';

import type { ElementType, ReactNode } from 'react';
import { cn } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { SidebarItem } from '~/config/sidebar';

interface LinksProps {
  items: SidebarItem[];
  onNavigate?: () => void;
  wrapper?: ElementType<{ children: ReactNode }>;
}

export default function Links(props: LinksProps) {
  const { items, onNavigate, wrapper: Wrapper = 'div' } = props;
  const pathname = usePathname();

  return items.map(item => {
    const isActive = pathname === item.path;
    let subMenu = null;

    if (item.items) {
      subMenu = (
        <div className="flex flex-col">
          {item.items.map(subItem => {
            const isSubActive = pathname === subItem.path;

            return (
              <div key={subItem.path}>
                <Link
                  className={cn('block text-base/4 pl-8 pr-2 py-2 hover:bg-default-100', {
                    'bg-default-100 text-primary': isSubActive,
                  })}
                  href={subItem.path}
                  onClick={onNavigate}
                >
                  {subItem.label}
                </Link>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <Wrapper key={item.path}>
        <Link
          className={cn('block text-base/4 py-2 px-4 hover:bg-default-100', {
            'bg-default-100 text-primary': isActive,
          })}
          href={item.path}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
        {subMenu}
      </Wrapper>
    );
  });
}
