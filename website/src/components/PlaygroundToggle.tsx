'use client';

import { usePathname } from 'next/navigation';

import Playground from '~/components/Playground';

export default function PlaygroundToggle() {
  const pathname = usePathname();

  if (pathname.endsWith('getting-started')) {
    return null;
  }

  return <Playground />;
}
