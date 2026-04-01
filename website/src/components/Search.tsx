'use client';

import '@docsearch/css';

import type { DocSearchHit } from '@docsearch/react';
import { DocSearch } from '@docsearch/react';

import useTheme from '~/hooks/useTheme';

function transformItems(items: DocSearchHit[]) {
  return items.map(item => {
    const url = new URL(item.url);

    url.host = window.location.host;
    url.protocol = window.location.protocol;

    return { ...item, url: url.toString() };
  });
}

export default function Search() {
  const { isDarkMode } = useTheme();

  return (
    <DocSearch
      apiKey="76d5e8668534da4aaf965eeb0cdad28c"
      appId="P1LI63S577"
      indices={['Documentation']}
      insights
      theme={isDarkMode ? 'dark' : 'light'}
      transformItems={transformItems}
    />
  );
}
