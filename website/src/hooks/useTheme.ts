import { useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export interface ThemeContextType {
  isDarkMode: boolean;
  mounted: boolean;
  toggleDarkMode: () => void;
}

export default function useTheme(): ThemeContextType {
  const { resolvedTheme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    isDarkMode: mounted && resolvedTheme === 'dark',
    mounted,
    toggleDarkMode: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
  };
}
