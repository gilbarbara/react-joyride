import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Documentation',
};

export default function Page() {
  redirect('/docs/getting-started');
}
