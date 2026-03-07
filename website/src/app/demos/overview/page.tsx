import type { Metadata } from 'next';

import Overview from './Overview';

export const metadata: Metadata = { title: 'Overview (Demo)' };

export default function BasicPage() {
  return <Overview />;
}
