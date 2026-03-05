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

// eslint-disable-next-line react-refresh/only-export-components
export * from './literals';
// eslint-disable-next-line react-refresh/only-export-components
export * from './types';
// eslint-disable-next-line react-refresh/only-export-components
export { default as useJoyride } from '~/hooks/useJoyride';
