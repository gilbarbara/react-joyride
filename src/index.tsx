import useJoyride from '~/hooks/useJoyride';
import { canUseDOM } from '~/modules/dom';

import type { Props } from '~/types';

function Joyride(props: Props) {
  const { Tour } = useJoyride(props);

  return Tour;
}

export default function ReactJoyride(props: Props) {
  if (!canUseDOM()) {
    return null;
  }

  return <Joyride {...props} />;
}

export { defaultLocale, defaultOptions } from './defaults';
export * from './literals';
export * from './types';
export { default as useJoyride } from '~/hooks/useJoyride';
