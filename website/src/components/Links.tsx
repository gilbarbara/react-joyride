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

function isExactPath(pathname: string, path: string) {
  return pathname === path;
}

function isInSection(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

const linkBase =
  'block rounded-md text-sm leading-5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** High-contrast current page: weight + surface, not primary-on-muted (fails in dark). */
const linkActive = 'bg-default-200 font-medium text-foreground';

export default function Links(props: LinksProps) {
  const { items, onNavigate, wrapper: Wrapper = 'div' } = props;
  const pathname = usePathname();

  return items.map(item => {
    const isActive = isExactPath(pathname, item.path);
    const sectionActive = Boolean(item.items?.length) && isInSection(pathname, item.path);
    let subMenu = null;

    if (item.items) {
      subMenu = (
        <div className="flex flex-col gap-0.5 mt-0.5 mb-1 ml-2 border-l border-default pl-2">
          {item.items.map(subItem => {
            const isSubActive = isExactPath(pathname, subItem.path);

            return (
              <div key={subItem.path}>
                <Link
                  aria-current={isSubActive ? 'page' : undefined}
                  className={cn(
                    linkBase,
                    'pl-3 pr-2 py-2 text-foreground-500 hover:bg-default-100 hover:text-foreground',
                    { [linkActive]: isSubActive },
                  )}
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
          aria-current={isActive ? 'page' : undefined}
          className={cn(linkBase, 'py-2 px-3 hover:bg-default-100', {
            [linkActive]: isActive,
            'font-medium text-foreground': !isActive && sectionActive,
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
