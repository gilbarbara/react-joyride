'use client';

import { useEffect, useState } from 'react';

export default function useIsE2E() {
  const [isE2E, setIsE2E] = useState(false);

  useEffect(() => {
    setIsE2E(new URLSearchParams(window.location.search).has('e2e'));
  }, []);

  return isE2E;
}
