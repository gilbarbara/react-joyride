import type { Metadata } from 'next';

import Scroll from './Scroll';

export const metadata: Metadata = { title: 'Scroll (Demo)' };

export default function ScrollPage() {
  return <Scroll />;
}
