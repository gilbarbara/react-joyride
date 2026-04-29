'use client';

import { type ReactNode, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import ConfigPanelFAB from '~/components/ConfigPanel/FAB';
import SourceCodeLink from '~/components/SourceCodeLink';

function DemosContent({ children }: { children: ReactNode }) {
  const params = useSearchParams();
  const isE2E = params?.has('e2e') ?? false;

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

export default function DemosLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <DemosContent>{children}</DemosContent>
    </Suspense>
  );
}
