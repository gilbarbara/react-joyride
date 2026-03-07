'use client';

import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { IntlProvider } from 'react-intl';

import { useConfig } from '~/context/ConfigContext';
import { intlMessages } from '~/modules/messages';
import ConfigProvider from '~/providers/ConfigProvider';
import ThemeProvider from '~/providers/ThemeProvider';

import ErrorFallback from '~/components/ErrorFallback';
import Header from '~/components/Header';

function App({ children }: { children: ReactNode }) {
  return (
    <IntlWrapper>
      <Header />
      <main className="w-full flex flex-col min-h-dvh pt-16 with-header print:pt-0" role="main">
        {children}
      </main>
    </IntlWrapper>
  );
}

function IntlWrapper({ children }: { children: ReactNode }) {
  const { localeKey } = useConfig();

  return (
    <IntlProvider locale={localeKey} messages={intlMessages[localeKey]}>
      {children}
    </IntlProvider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider>
        <ConfigProvider>
          <App>{children}</App>
        </ConfigProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
