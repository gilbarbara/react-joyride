import type { ReactNode } from 'react';
import { HeroUIProvider, type HeroUIProviderProps, ToastProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useRouter } from 'next/navigation';

interface ThemeProviderProps {
  children: ReactNode;
  heroUIProps?: Omit<HeroUIProviderProps, 'children'>;
}

export default function ThemeProvider({ children, heroUIProps }: ThemeProviderProps) {
  const router = useRouter();

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <HeroUIProvider {...heroUIProps} navigate={path => router.push(path)}>
        <ToastProvider
          placement="bottom-right"
          regionProps={{ className: 'z-250' }}
          toastProps={{ shouldShowTimeoutProgress: true, variant: 'solid' }}
        />
        {children}
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
