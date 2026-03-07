import type { Metadata } from 'next';

import Chat from './Chat';

export const metadata: Metadata = {
  title: 'Chat App (Demo)',
};

export default function ChatPage() {
  return <Chat />;
}
