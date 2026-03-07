import type { Metadata } from 'next';

import Home from './Home';

export const metadata: Metadata = { title: 'Multi Route (Demo)' };

export default function MultiRoutePage() {
  return <Home />;
}
