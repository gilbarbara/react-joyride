import type { ReactNode } from 'react';
import { IntlProvider } from 'react-intl';

import { messages } from './messages';

interface IntlProps {
  children: ReactNode;
  locale: string;
}

export default function Intl(props: IntlProps) {
  const { children, locale } = props;

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  );
}
