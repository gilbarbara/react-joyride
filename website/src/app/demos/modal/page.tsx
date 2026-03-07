import type { Metadata } from 'next';

import Modal from './Modal';

export const metadata: Metadata = { title: 'Modal (Demo)' };

export default function ModalPage() {
  return <Modal />;
}
