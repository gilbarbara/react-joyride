'use client';

import { useEffect } from 'react';

export default function HashScroll() {
  useEffect(() => {
    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView();
    }
  }, []);

  return null;
}
