import type { Metadata } from 'next';

import Controlled from './Controlled';

export const metadata: Metadata = { title: 'Controlled (Demo)' };

export default function ControlledPage() {
  return <Controlled />;
}
