import '../css/index.css';

import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import Providers from './providers';

const inter = Inter({
  axes: ['opsz'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: { default: 'React Joyride', template: '%s | React Joyride' },
  description: 'Create guided tours and walkthroughs for your React apps',
  metadataBase: new URL('https://react-joyride.com'),
  openGraph: {
    type: 'website',
    siteName: 'React Joyride',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
  },
  icons: { icon: '/favicon.ico' },
  other: {
    'algolia-site-verification': '0228AC1115BB54F2',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
