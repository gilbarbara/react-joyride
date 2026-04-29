'use client';

import type { ReactNode } from 'react';

import useIsE2E from '~/hooks/useIsE2E';

import ConfigPanelFAB from '~/components/ConfigPanel/FAB';
import SourceCodeLink from '~/components/SourceCodeLink';

export default function DemosLayout({ children }: { children: ReactNode }) {
  const isE2E = useIsE2E();

  return (
    <div className="flex flex-col flex-1 " id="demo-pages">
      {isE2E && (
        <style>
          {`
          #app-header, nextjs-portal { display: none !important; }
          .with-header { padding-top: 0 !important; }
          #demo-pages * { scroll-margin-top: 0 !important; }
        `}
        </style>
      )}
      {children}
      {!isE2E && <ConfigPanelFAB />}
      {!isE2E && <SourceCodeLink />}
    </div>
  );
}
