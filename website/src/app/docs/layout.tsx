import type { ReactNode } from 'react';

import { sidebar } from '~/config/sidebar';

import HashScroll from '~/components/HashScroll';
import Links from '~/components/Links';
import PlaygroundToggle from '~/components/PlaygroundToggle';

export default function DocumentsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HashScroll />
      <div className="min-h-screen flex gap-2">
        <div className="hidden md:flex flex-col w-64 shrink-0 sticky top-16 h-[calc(100dvh-4rem)] overflow-y-auto">
          <Links items={sidebar.docs} />
        </div>
        <div
          className="py-4 px-4 md:border-l md:border-default max-w-full md:max-w-5xl"
          id="documentation-pages"
        >
          {children}
        </div>
      </div>
      <PlaygroundToggle />
    </>
  );
}
