import type { Metadata } from 'next';

import CustomComponents from './CustomComponents';

export const metadata: Metadata = { title: 'Custom Components (Demo)' };

export default function CustomComponentsPage() {
  return <CustomComponents />;
}
