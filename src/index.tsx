import { useJoyride } from '~/hooks/useJoyride';
import { canUseDOM } from '~/modules/dom';

import type { Props } from '~/types';

function JoyrideTour(props: Props) {
  const { Tour } = useJoyride(props);

  return Tour;
}

export function Joyride(props: Props) {
  if (!canUseDOM()) {
    return null;
  }

  return <JoyrideTour {...props} />;
}

export { defaultLocale, defaultOptions } from './defaults';
export * from './literals';
export * from './types';
export { useJoyride } from '~/hooks/useJoyride';
