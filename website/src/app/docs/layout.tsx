import type { ReactNode } from 'react';

import { sidebar } from '~/config/sidebar';

import HashScroll from '~/components/HashScroll';
import Links from '~/components/Links';
import PlaygroundToggle from '~/components/PlaygroundToggle';

export default function DocumentsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HashScroll />
      <div className="min-h-screen flex">
        <nav
          aria-label="Documentation"
          className="hidden sm:flex flex-col w-60 shrink-0 sticky top-16 h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-r border-default py-4 px-2"
        >
          <div className="flex flex-col gap-0.5">
            <Links items={sidebar.docs} />
          </div>
        </nav>
        <div className="py-4 px-4 sm:px-8 max-w-full md:max-w-5xl min-w-0 flex-1" id="documentation-pages">
          {children}
        </div>
      </div>
      <PlaygroundToggle />
    </>
  );
}
